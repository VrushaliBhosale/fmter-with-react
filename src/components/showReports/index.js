import React, { useEffect, useState, useContext } from 'react';
import ReportViewer from 'react-lighthouse-viewer';
import CompairReports from '../compairReports';
import {getAllRunIds, getLastReport} from '../../services/api-methods';
import {ReportContext} from '../../services/reports-context'
import './style.css';
import { Route, Link } from 'react-router-dom';
var Loader = require('react-loader');

const ShowReports = () => {
  const [allRuns,setAllRuns] = useState([]);
  const [allScores,setAllScores] = useState([]);
  const [report,setReport] = useState();
  const [selectedIndex,setSelectedIndex] = useState();
  const [initialRun,setInitialRun] = useState();  
  const [activeRoute,setActiveRoute] = useState(false);
  const [reportlLoader,setReportLoader] = useState(true);
  const [loader,setLoader] = useState(true);

  const context = useContext(ReportContext);
  const {data} = context.state;

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
    context.dispatch({ type: 'addRuns' });
    setLoader(false);
    let isSubscribed = true;
    if (isSubscribed) {
      reslovePromies().then(runs=>{
        console.log("runs :",runs)
        setAllRuns(runs);
        setAllScores(runs[runs.length-1].urls);
        setInitialRun(runs.length-1);
        setInitialReport(runs[runs.length-1].urls[0].id);
        setLoader(true);
      });
    }
    return () => isSubscribed = false
  },[])

  const setInitialReport = (id) => {
    setReportLoader(false)
    getLastReport(id).then(score=>{
      setReport(JSON.parse(score.report)); 
      setReportLoader(true)
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

  const handleClick = () => {
    setActiveRoute(!activeRoute)
  }

  const runList = 
  allRuns.map((run,index)=>{
    return (
    <option value={index} key={index}>{run.created_date}</option>
    )
  })

  const scoreList = allScores.map((data,index)=>{
    return (
      <option value={data.id} key={index}>{data.url}</option>
      )
  });

  return (
    <div>  
    {
      !activeRoute &&
     <Loader loaded={loader}>
       {
         allRuns.length>0 && allScores.length>0 &&
      <div style={{backgroundColor:'#000000'}}>
        <div className="report-inputs-wrapper">
          <div className="report-imput-elem-spacing">
            <select 
              value={initialRun}
              onChange={handleRunSelect} 
            > 
              {runList}
            </select>
          </div>
          <div className="report-imput-elem-spacing">
            <select 
              value={selectedIndex}
              onChange={handleScoreSelect}
            > 
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
        { (!allRuns.length || !allScores.length)&&<h3>Runs and scores are empty</h3>}
        </Loader>
      } 
      {/* {
        activeRoute && 
        allRuns && <CompairReports runs={allRuns} changeActiveRoute={handleClick}/>
      } */}

      {/* <Route path="/compair-reports"
        render={props => <CompairReports runs={allRuns} changeActiveRoute={handleClick}/>}
      />     */}
  </div>
  )
}

export default ShowReports;