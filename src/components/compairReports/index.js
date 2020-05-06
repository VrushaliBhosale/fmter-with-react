import React, { useEffect,useState } from 'react';
import ShowCommon from '../showCommonComparision';
import { getLastReport,getRunById } from '../../services/api-methods';
import { Link, useLocation, useParams} from 'react-router-dom';

const CompairReports = (props) => {
  const [runs,setRuns] = useState([]);
  const [runId1,setRunId1] = useState();
  const [runId2,setRunId2] = useState();
  const [timeStamps,setTimeStamps] = useState({run1:'',run2:''})
  const [audits,setAudits] = useState([]);
  const [remainingUrls,setRemainingUrls] = useState([]);
  const [msg,setMsg] = useState('Select your timestamps to show the reports');
  let { run1,run2 } = useParams();
  let location=useLocation();
 
  const resolvePromise = async() => {
    let results = await getScoresFromUrlId();
    return results;
  }
  const getScoresFromUrlId = async() => {
    let run1Data = await getRunById(run1);
    let run2Data = await getRunById(run2);
    if(run1Data&&run2Data){
      return {run1Data,run2Data};
    }
    else{
      setMsg("set valid timeStamps");
      return;
    }
  }

  useEffect(()=>{
    if(run1 && run2){
      if(run1!==run2){  
      resolvePromise().then(res=>{
      if(res){
        setTimeStamps({run1:{...res.run1Data},run2:{...res.run2Data}});
      }else{setMsg("set Valid TimeStamps")}
        });
        }else{
          setMsg("please select different timestamps to compare");
          setAudits([]);
          setRemainingUrls([]);
        }
      }
  },[run1,run2])

  useEffect(()=>{
    if(timeStamps.run1&&timeStamps.run2&&run1&&run2){
      if(timeStamps.run1!==timeStamps.run2){
        checkRuns();
      }
    }
  },[timeStamps])

  useEffect(()=>{
    if(location.state){
      const {runs} = location.state; 
      if(runs.allRuns){
        setRuns(runs.allRuns);
        setRunId1(runs.allRuns[0]._id);setRunId2(runs.allRuns[0]._id);
      }else if(runs){
        setRuns(runs);
        setRunId1(runs[0]._id);setRunId2(runs[0]._id);
      }
    }
  },[])

const runList = runs && runs.map((run,index)=>{
  return <option key={index} value={run._id}>{run.created_date}</option>
})

const checkRuns = () => {
  setAudits([]);
  setRemainingUrls([]);
  setMsg("loading ..");
  if(timeStamps.run1 && timeStamps.run2){
    const {run1,run2} = timeStamps;
    if(run1 !== run2 ){
      compairUrls(run1.urls,run2.urls);
    }else{
      setMsg("please select different timestamps to compare");
    }
  }else{
    setMsg("Please select timestamps")  
  } 
}

const compairUrls = async (urls1,urls2) => {
let common=[];
  await urls1.map(url1=>{
   urls2.map(async url2=>{
     if(url1.url===url2.url){ 
       common.push({url:url1.url,id1:url1.id,id2:url2.id})
      }
   })
 })
 if(common.length>0){ 
  let data = await getCommonAudits(common)
   setAudits(data); 
  }
if(!common.length){setMsg("no  common results ")}
  getRemainingScore(common);
}

const getCommonAudits = (common) => {
  const data = Promise.all(
    common.map(async (element) => {
      let run1Audits,run2Audits,diff={};
      await getLastReport(element.id1).then(result=>run1Audits=result.audits);
      await getLastReport(element.id2).then(result=>run2Audits=result.audits);
      let keys = Object.keys(run1Audits);
      keys.map(key=>{
        if(run1Audits[key] && run2Audits[key]){
         diff[key] = run1Audits[key]-run2Audits[key];
        }
      })  
      let data = {url:element.url,timeStamp1:timeStamps.run1.created_date,timeStamp2:timeStamps.run2.created_date,run1Audits:run1Audits,run2Audits:run2Audits,diff};
      return data;
    })
  );
  return data;
}

const getRemainingScore = async(audits) =>{
  let remaining=[];
  if(audits && audits.length>0){
  let isPresent = false;
  await timeStamps.run1.urls.map(async elem=>{
    audits.map(each=>{
      if(elem.url===each.url){
        isPresent=true;
      }
    })
    !isPresent && remaining.push({data:elem,runtime:timeStamps.run1.created_date});
    isPresent=false;
  })
 await timeStamps.run2.urls.map(async elem=>{
    audits.map(each=>{
      if(elem.url===each.url){
        isPresent=true;
      }
    })
    !isPresent && remaining.push({data:elem,runtime:timeStamps.run2.created_date});
    isPresent=false;
  })
  }
  else{
     timeStamps.run1 && timeStamps.run1.urls.map(async elem=>{
      remaining.push({data:elem,runtime:timeStamps.run1.created_date});
    })
     timeStamps.run2 && timeStamps.run2.urls.map(async elem=>{
      remaining.push({data:elem,runtime:timeStamps.run2.created_date});
    })
  }
    if(remaining.length>0){
      let data = await getCalculatedAudits(remaining)
      setRemainingUrls(data);
     }
  }

function getCalculatedAudits(remaining) {
  const data = Promise.all(
    remaining.map(async (url) => {
      const result = await getLastReport(url.data.id);
      let data = {url:url.data.url,timeStamp:url.runtime,scores:result.audits};
      return data;
    })
  );
  return data;
}

  return (
    <div style={{marginLeft:'30px',backgroundColor:'#00000'}}>
      <Link to='/'>
      <button>Back to Home</button>
      </Link>
      <div>
      {runs.length>0 && <div>
        <select 
          onChange={(event)=>setRunId1(event.target.value)} 
          value={runId1}
          style={{marginTop:'20px'}}> 
         <option>Select one</option>
          {runList}
        </select>
        <select   
          onChange={(event)=>setRunId2(event.target.value)} 
          value={runId2}
          style={{ marginLeft:'10px',marginTop:'20px'}}> 
         <option>Select one</option>
          {runList}
        </select>
        <Link to={{
           pathname:`/compare/${runId1}/${runId2}`,
           state:{runs:runs}
        }}>
          <button style={{ padding:'5px',marginLeft:'30px'}}>Submit</button>
          </Link>
      </div>
      }
      {
        (audits && audits.length>0) || (remainingUrls&&remainingUrls.length>0) ?
      <div>
        {audits&&audits.length>0 ? <ShowCommon audits={audits} /> : <h3>{msg}</h3>}
        {remainingUrls && remainingUrls.length>0 && <ShowCommon remaining={remainingUrls}/>}
      </div>
      : <h3>{msg}</h3>
      } 
      
    </div>
  </div>
  )

}

export default CompairReports 