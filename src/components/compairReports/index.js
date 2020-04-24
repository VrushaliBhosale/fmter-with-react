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
    console.log("props",props)
  },[props])

const runList = runs.map((run,index)=>{
  return <option key={index} value={index}>{run.created_date}</option>
})

const selectTimeStamp = (event,param) => {
  let {value}=event.target
  console.log(runs[value])
  if(param==="run1"){
    setTimeStamps({...timeStamps,run1:runs[value]});
  }else{
    setTimeStamps({...timeStamps,run2:runs[value]});
  }
}

const checkRuns = () => {
  if(timeStamps.run1 && timeStamps.run2){
    const {run1,run2} = timeStamps;
    if(run1 !== run2 ){
      run1.urls.length > run2.urls.length ? compairUrls (run1.urls,run2.urls,"run1") : compairUrls(run2.urls,run1.urls,"run2")
    }else{
      alert("please select different timestamps to compairs")
    }
  }else{
    alert("Please selecte timestamps")  
  } 
}

const compairUrls = async (urls1,urls2,max) => {
  await urls1.map(url1=>{
   urls2.map(async url2=>{
     if(url1.url===url2.url){ 

      console.log("common :",url1.url);
      let run1Audits,run2Audits,diff={};
       await getLastReport(url1.id).then(result=>run1Audits=result.audits)
       await getLastReport(url1.id).then(result=>run2Audits=result.audits)
      console.log(run1Audits,run2Audits);
      let keys = Object.keys(run1Audits);
      keys.map(key=>{
        console.log(run1Audits[key],run2Audits[key],run1Audits[key]-run2Audits[key])
        run1Audits[key] && run2Audits[key] && 
        (diff[key] = run1Audits[key]-run2Audits[key])
      })
      console.log("diff :",diff)
       let data = {
         url:url2.url,
         timeStamp1:max==="run1"?timeStamps.run1.created_date:timeStamps.run2.created_date,
         timeStamp2:max==="run1"?timeStamps.run2.created_date:timeStamps.run1.created_date,
         run1Audits,
         run2Audits,
         diff
       }
       await setAudits(state=>[...state,data]);
      }
   })
 })
 if(audits.length===0){
   setMsg("No results to comapair")
 }
}
useEffect(()=>{
  const getRemainingScore = async() =>{
  let remaining=[];
  if(audits && audits.length>0){
  setMsg("");
  let isPresent = false;
  await timeStamps.run1.urls.map(async elem=>{
    audits.map(each=>{
      if(elem.url===each.url){
        isPresent=true;
      }
    })
    !isPresent && console.log("dosnt present form run1",elem.url);
    !isPresent && remaining.push(elem);
    isPresent=false;
  })
 await timeStamps.run2.urls.map(async elem=>{
    audits.map(each=>{
      if(elem.url===each.url){
        isPresent=true;
      }
    })
    !isPresent && console.log("dosnt present form run2",elem.url);
    !isPresent && remaining.push(elem);
    isPresent=false;
  })

  if(remaining.length>0){
      let data = await getCalculatedAudits(remaining)
      setRemainingUrls(data);
     }
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
      <h3>{msg}</h3>
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
      <div>
        {audits&&audits.length>0 &&  <ShowCommon audits={audits} />}
        {remainingUrls && remainingUrls.length>0 && <ShowCommon remaining={remainingUrls}/>}
        </div>
        
      </div>
    </div>
  )
}

export default CompairReports