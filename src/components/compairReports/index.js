import React, { useEffect,useState } from 'react';
import ShowCommon from '../showCommonComparision'
const CompairReports = (props) => {
  const [runs,setRuns] = useState(props.runs);
  const [timeStamps,setTimeStamps] = useState({run1:'',run2:''})
  const [audits,setAudits] = useState([]);
  const [remainingUrls,setRemainingUrls] = useState([]);
  const [msg,setMsg] = useState('Select your timestamps to show the reports');
  useEffect(()=>{
    console.log("props :",props)
    setRuns(props.runs);
  },[props])

const runList = runs.map((run,index)=>{
  return <option key={index} value={index}>{run.created_date}</option>
})

const selectTimeStamp = (event,param) => {
  console.log(event.target.value,param)
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
      run1.urls.length > run2.urls.length ? compairUrls(run1.urls,run2.urls,"run1") : compairUrls(run2.urls,run1.urls,"run2")
    }else{
      alert("please select different timestamps to compairs")
    }
  }else{
    alert("Please selecte timestamps")
  } 
}

const compairUrls = async (urls1,urls2,max) => {
  console.log("hello")
  await urls1.map(url1=>{
    let data1 = JSON.parse(url1.report);
   urls2.map(async url2=>{
    
     if(url1.url===url2.url){ 
      //  console.log("url :",url1.url)

       let data2 = JSON.parse(url2.report);
       console.log("per :",data1.categories.performance.score,data2.categories.performance.score);
      
       let run1Scores = {
         scores:{
          performance:data1.categories.performance.score*100,
          accessibility:data1.categories.accessibility.score*100,
          bestPractices:data1.categories["best-practices"].score*100,
          seo:data1.categories.seo.score*100,
          pwa:data1.categories.pwa.score*100
         }
       }
       let run2Scores = {
         scores:{
          performance:data2.categories.performance.score*100,
          accessibility:data2.categories.accessibility.score*100,
          bestPractices:data2.categories["best-practices"].score*100,
          seo:data2.categories.seo.score*100,
          pwa:data2.categories.pwa.score*100
         }
       }
       let diff = { 
        performance:run1Scores.scores.performance-run2Scores.scores.performance,
        accessibility:run1Scores.scores.accessibility-run2Scores.scores.accessibility,
        bestPractices:run1Scores.scores.bestPractices-run1Scores.scores.bestPractices,
        seo:run1Scores.scores.seo-run1Scores.scores.seo,
        pwa:run1Scores.scores.pwa-run2Scores.scores.pwa
       }
       let data = {
         url:url2.url,
         timeStamp1:max==="run1"?timeStamps.run1.created_date:timeStamps.run2.created_date,
         timeStamp2:max==="run1"?timeStamps.run2.created_date:timeStamps.run1.created_date,
         run1Scores,
         run2Scores,
         diff
       }
       console.log(data);
       await setAudits(state=>[...state,data]);
      }
   })
 })
 if(audits.length===0){
   setMsg("no common comaprision to show");
 }
}
useEffect(()=>{
  console.log("audits changed ..",audits)
  let remaining=[];
if(audits && audits.length>0){
  setMsg("");
  let isPresent = false;
  console.log("hello",audits)
  timeStamps.run1.urls.map(elem=>{
    audits.map(each=>{
      if(elem.url===each.url){
        isPresent=true;
      }
    })
    !isPresent && console.log("dosnt present form run1",elem.url);
    if(!isPresent){
      let parsedReport = JSON.parse(elem.report);
      let data = {
        url:elem.url,
        timeStamp:timeStamps.run1.created_date,
        scores:{
          performance:parsedReport.categories.performance.score*100,
          accessibility:parsedReport.categories.accessibility.score*100,
          bestPractices:parsedReport.categories["best-practices"].score*100,
          seo:parsedReport.categories.seo.score*100,
          pwa:parsedReport.categories.pwa.score*100
          }
      }
      remaining.push(data)
    }
    isPresent=false;
  })
  timeStamps.run2.urls.map(elem=>{
    audits.map(each=>{
      if(elem.url===each.url){
        isPresent=true;
      }
    })
    !isPresent && console.log("dosnt present form run2",elem.url);
    if(!isPresent){
      let parsedReport = JSON.parse(elem.report);
      let data = {
        url:elem.url,
        timeStamp:timeStamps.run2.created_date,
        scores:{
          performance:parsedReport.categories.performance.score*100,
          accessibility:parsedReport.categories.accessibility.score*100,
          bestPractices:parsedReport.categories["best-practices"].score*100,
          seo:parsedReport.categories.seo.score*100,
          pwa:parsedReport.categories.pwa.score*100
          }
      }
      remaining.push(data)
    }
    isPresent=false;
  })
  console.log("remainin :",remaining)
  remaining.length>0 && setRemainingUrls(remaining);
}
},[audits])

  return (
    <div style={{marginLeft:'30px'}}>
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
        {/* {audits && console.log("commom :",audits)}
        {remainingUrls && console.log("diff from 1 :",remainingUrls)} */}
        {audits&&audits.length>0 &&  <ShowCommon audits={audits} />}
        {remainingUrls && remainingUrls.length>0 && <ShowCommon remaining={remainingUrls}/>}
        </div>
        
      </div>
    </div>
  )
}

export default CompairReports