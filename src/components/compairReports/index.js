import React, { useEffect,useState } from 'react';
import ShowCommon from '../showCommonComparision';
import { getLastReport } from '../../services/api-methods';

const CompairReports = (props) => {
  const [runs,setRuns] = useState(props.runs);
  const [timeStamps,setTimeStamps] = useState({run1:'',run2:''})
  const [audits,setAudits] = useState([]);
  const [remainingUrls,setRemainingUrls] = useState([]);
  const [msg,setMsg] = useState('Select your timestamps to show the reports');
  useEffect(()=>{
    setRuns(props.runs);
  },[props])

const runList = runs.map((run,index)=>{
  return <option key={index} value={index}>{run.created_date}</option>
})

const selectTimeStamp = (event,param) => {
  let {value}=event.target
  console.log("time :",new Date(value).getTime());
  if(param==="run1"){
    setTimeStamps({...timeStamps,run1:runs[value]});
  }else{
    setTimeStamps({...timeStamps,run2:runs[value]});
  }
}

const checkRuns = () => {
  setAudits([]);
  setRemainingUrls([]);
  setMsg("loading ..")
  if(timeStamps.run1 && timeStamps.run2){
    const {run1,run2} = timeStamps;
    if(run1 !== run2 ){
      compairUrls(run1.urls,run2.urls);
    }else{
      alert("please select different timestamps to compairs")
    }
  }else{
    alert("Please selecte timestamps")  
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
 console.log("common :",common)
 if(common.length>0){ 
   let data = await getCommonAudits(common);
    console.log("data :",data)
   setAudits(data); 
  }
if(!common.length){
  setMsg("no  common results ")
  }
}

const getCommonAudits = (common) => {
  const data = Promise.all(
    common.map(async (element) => {
      let run1Audits,run2Audits,diff={},str='';
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

useEffect(()=>{
  const getRemainingScore = async() =>{
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
  getRemainingScore();
},[audits])

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
      <button onClick={props.changeActiveRoute}>Back</button>
      <div>
      <div>
        <select 
          onChange={(event)=>selectTimeStamp(event,"run1")} 
          style={{marginTop:'20px'}}
        > 
         <option>Select one</option>
          {runList}
        </select>
        <select   
          onChange={(event)=>selectTimeStamp(event,"run2")} 
          style={{ marginLeft:'10px',marginTop:'20px'}}     
        > 
         <option>Select one</option>
          {runList}
        </select>
        <button style={{ padding:'5px',marginLeft:'30px'}} onClick={checkRuns}>Submit</button>
      </div>

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