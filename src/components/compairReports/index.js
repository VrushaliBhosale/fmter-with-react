import React, { useEffect,useState } from 'react';
import ShowCommon from '../showCommonComparision';
import { getLastReport,getRunById } from '../../services/api-methods';
import { Link, useLocation, useHistory, useParams, useRouteMatch} from 'react-router-dom';

const CompairReports = (props) => {
  const [runs,setRuns] = useState([]);
  const [timeStamps,setTimeStamps] = useState({run1:'',run2:''})
  const [audits,setAudits] = useState([]);
  const [remainingUrls,setRemainingUrls] = useState([]);
  const history = useHistory();
  const [msg,setMsg] = useState('Select your timestamps to show the reports');
  const [isSubmitted,setIsSubmitted] = useState(false)
  const {path,url} = useRouteMatch();
  let { run1,run2 } = useParams();
  let location=useLocation();
 
  const resolvePromise = async() => {
    let abc = await getScoresFromUrlId();
    return abc;
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

  const handleIsSubmitted = () => {
    setIsSubmitted(!isSubmitted)
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
    if(timeStamps.run1&&timeStamps.run2&&run1&&run2&&isSubmitted){
      if(timeStamps.run1!==timeStamps.run2){
        checkRuns();
      }else{
        setMsg("please select different timestamps to compare");
      }
    }
  },[timeStamps,isSubmitted])

  useEffect(()=>{
    if(location.state){
      location.state.runs.allRuns ? setRuns(location.state.runs.allRuns) :
      location.state.runs && setRuns(location.state.runs)
    }
  },[])

const runList = runs && runs.map((run,index)=>{
  return <option key={index} value={index}>{run.created_date}</option>
})

const selectTimeStamp = (event,param) => {
  let {value}=event.target
  if(param==="run1"){
    setTimeStamps({...timeStamps,run1:runs[value]});
  }else{
    setTimeStamps({...timeStamps,run2:runs[value]});
  }
}

const checkRuns = () => {
  setAudits([]);
  setRemainingUrls([]);
  setMsg("loading ..");
  handleIsSubmitted();
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
    !isPresent && remaining.push(elem);
    isPresent=false;
  })
 await timeStamps.run2.urls.map(async elem=>{
    audits.map(each=>{
      if(elem.url===each.url){
        isPresent=true;
      }
    })
    !isPresent && remaining.push(elem);
    isPresent=false;
  })
  }
  else{
     timeStamps.run1 && timeStamps.run1.urls.map(async elem=>{
      remaining.push(elem);
    })
     timeStamps.run2 && timeStamps.run2.urls.map(async elem=>{
      remaining.push(elem);
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
      const result = await getLastReport(url.id);
      let data = {url:url.url,timeStamp:timeStamps.run2.created_date,scores:result.audits};
      return data;
    })
  );
  return data;
}

  return (
    <div style={{marginLeft:'30px'}}>
      <Link to='/'>
      <button>Back to Home</button>
      </Link>
      <div>
      {runs.length>0 && <div>
        <select 
          onChange={(event)=>selectTimeStamp(event,"run1")} 
          style={{marginTop:'20px'}}> 
         <option>Select one</option>
          {runList}
        </select>
        <select   
          onChange={(event)=>selectTimeStamp(event,"run2")} 
          style={{ marginLeft:'10px',marginTop:'20px'}}> 
         <option>Select one</option>
          {runList}
        </select>
        <Link to={{
          pathname:`/compare/${timeStamps.run1._id}/${timeStamps.run2._id}`,
          state:{runs:runs}}}>     
           <button style={{ padding:'5px',marginLeft:'30px'}} onClick={handleIsSubmitted}>Submit</button>
         </Link>
      </div>
      }
      {run1&&run2&&!runs.length&&<button onClick={handleIsSubmitted}>run</button>}
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