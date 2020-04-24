import React, { useEffect, useState } from 'react';
import ReportViewer from 'react-lighthouse-viewer';
import CompairReports from '../compairReports';
import {getAllRunIds, getLastReport} from '../../services/api-methods'
const ShowReports = () => {
  const [allRuns,setAllRuns] = useState([]);
  const [allScores,setAllScores] = useState([]);
  const [report,setReport] = useState();
  const [selectedIndex,setSelectedIndex] = useState();
  const [initialRun,setInitialRun] = useState();  
  const [activeRoute,setActiveRoute] = useState(false);
  useEffect(()=>{
    async function getAUdits(){
      await getAllRunIds()
      .then(async runs=>{
        await setAllRuns(runs);
        setAllScores(runs[runs.length-1].urls);
        setInitialRun(runs.length-1);
        setInitialReport(runs[runs.length-1].urls[0].id);
      })
      .catch(function(error){
        console.log("Error :",error);
      });
    }
  getAUdits();
  },[])

  const setInitialReport = (id) => {
    setReport('');
    getLastReport(id).then(score=>{
      setReport(JSON.parse(score.report));
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
      activeRoute===false &&
    <div style={{backgroundColor:'#000000'}}>
      <div>
        <select 
          value={initialRun}
          onChange={handleRunSelect} 
          style={{ padding:'20px',marginLeft:'1000px',marginTop:'20px'}}
        > 
          {runList}
        </select>
      </div>
      <div>
        {
          <select 
            value={selectedIndex}
            onChange={handleScoreSelect}
            style={{ padding:'20px',marginLeft:'1000px',marginTop:'10px'}}
          > 
            {scoreList}
          </select>
        }
        </div>
         <button onClick={handleClick} style={{
           marginLeft:'1000px',
           marginTop:'10px'
         }}>Compair reports</button>
        {report && <ReportViewer json={report} key={getUniqueKey()}/> }
      </div>
      }
      {
        activeRoute===true && 
        allRuns && <CompairReports runs={allRuns} changeActiveRoute={handleClick}/>
      }
    </div>
  )
}

export default ShowReports;