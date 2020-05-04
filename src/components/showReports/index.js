import React, { useEffect, useState, useContext } from 'react';
import ReportViewer from 'react-lighthouse-viewer';
import {getAllRunIds, getLastReport} from '../../services/api-methods';
import {ReportContext} from '../../services/reports-context'
import './style.css';
import { Link } from 'react-router-dom';
var Loader = require('react-loader');

const ShowReports = () => {
  const [allRuns,setAllRuns] = useState([]);
  const [allScores,setAllScores] = useState([]);
  const [report,setReport] = useState();
  const [selectedIndex,setSelectedIndex] = useState();
  const [initialRun,setInitialRun] = useState();  
  const [reportlLoader,setReportLoader] = useState(true);
  const [loader,setLoader] = useState(true);

  const context = useContext(ReportContext);
  // const {data} = context.state;

  const reslovePromies = async() =>{
    let data = await getAUdits();
    return data;
  }
  async function getAUdits(){
   return  await getAllRunIds()
    .then(async runs=>{
      return runs;
    })
    .catch(function(error){
      console.log("Error :",error);
    });
  }
  useEffect(()=>{
    // context.dispatch({ type: 'addRuns' });
    setLoader(false);
    let isSubscribed = true;
    if (isSubscribed) {
      reslovePromies().then(runs=>{
        if(runs){
        setAllRuns(runs);
        setAllScores(runs[runs.length-1].urls);
        setInitialRun(runs.length-1);
        setInitialReport(runs[runs.length-1].urls[0].id);
        setLoader(true);
        }else{
          setLoader(true);
        }
      });
    }
    return () => isSubscribed = false
  },[])

  const setInitialReport = (id) => {
    setReportLoader(false)
    getLastReport(id).then(score=>{
      try{
      let data = JSON.parse(score.report);
      setReport(data); 
      setReportLoader(true)
      }catch(err){console.log("error in parsing the json report :",err)}
    })
  }

  const handleRunSelect = async(event) => {
    const {value} = event.target;
    setInitialRun(value);
    await allRuns[value].urls[0] && setInitialReport(allRuns[value].urls[0].id);  
    await setSelectedIndex(allRuns[value].urls[0].id);
    await setAllScores(allRuns[value].urls);
  }

  const handleScoreSelect = async(event) => {
    const {value} = event.target;
    setSelectedIndex(value);
    setInitialReport(value);
  }

  const getUniqueKey = () => {
    return Date.now();
  }
  const runList = 
  allRuns&&allRuns.map((run,index)=>{
    return (
    <option value={index} key={index}>{run.created_date}</option>
    )
  })||null

  const scoreList = allScores.map((data,index)=>{
    return (
      <option value={data.id} key={index}>{data.url}</option>
      )
  });

  return (
    <div>  
    {
      <div>
      <Loader loaded={loader}>
         { (!allRuns.length || !allScores.length)&&<h3>Runs and scores are empty</h3> }
       {
         allRuns.length>0 && allScores.length>0 &&
      <div style={{backgroundColor:'#000000'}}>
        <div className="report-inputs-wrapper">
          <div className="report-imput-elem-spacing">
            <select 
              value={initialRun}
              onChange={handleRunSelect} > 
              {runList}
            </select>
          </div>
          <div className="report-imput-elem-spacing">
            <select 
              value={selectedIndex}
              onChange={handleScoreSelect}> 
              {scoreList}
            </select>
            </div>
            <Link to={{
              pathname:"/compare",
              state:{
                runs:{allRuns}
              }
            }}>
              <button className="compair-btn">Compair reports</button>
            </Link>
          </div>
           <Loader loaded={reportlLoader}>
            {report && <ReportViewer json={report} key={getUniqueKey()}/> }
          </Loader>
         
        </div> 
        }
        </Loader>
        </div>
      } 
  </div>
  )
}

export default ShowReports;