import React, { useEffect, useState, useReducer } from 'react';
import ReportViewer from 'react-lighthouse-viewer';
import axios from 'axios';

const ShowReports = () => {
  const url="https://cart-api-ts.herokuapp.com/scores"
  const [allRuns,setAllRuns] = useState([]);
  const [allScores,setAllScores] = useState([]);
  const [report,setReport] = useState();
  const [selectedIndex,setSelectedIndex] = useState();
  useEffect(()=>{
    async function getAUdits(){
      await axios.get(url)
      .then(async function(response){
        const {message} = response.data;
        console.log("data :",message);
        await setAllRuns(message);
        await setAllScores(message[0].urls);
        let initialReport = message[0].urls[0].report;
        setInitialReport(initialReport);
      })
      .catch(function(error){
          console.log("Error :",error);
      });
    }
  getAUdits();
  },[])

  const setInitialReport = (initialReport) => {
    initialReport && setReport(JSON.parse(initialReport));
  }

  const handleRunSelect = async(event) => {
    const {value} = event.target;
    await setSelectedIndex(allRuns[value].urls[0]._id);
    await setAllScores(allRuns[value].urls);
    await allRuns[value].urls[0] && setInitialReport(allRuns[value].urls[0].report);  
  }

  const handleScoreSelect = async(event) => {
    const {value} = event.target;
    setSelectedIndex(value);
    allScores.map(score=>{
      if(score._id===value){
        let report = JSON.parse(score.report);
        setReport(report);
      }
    })
  }

  const getUniqueKey = () => {
    return Date.now();
  }

  const runList = 
  allRuns.map((run,index)=>{
    return (
    <option value={index} key={index}>{run.created_date}</option>
    )
  })

  const scoreList = allScores.map((data,index)=>{
    return (
      <option value={data._id} key={index}>{data._id}</option>
      )
  });


  return (
    <div style={{backgroundColor:'#000000'}}>  
      <div>
        <select 
          onChange={handleRunSelect} 
          style={{ padding:'20px',marginLeft:'1000px',marginTop:'20px'}}
        > 
          {runList}
        </select>
      </div>
      <div>
      {
        scoreList && 
        <select 
          value={selectedIndex}
          onChange={handleScoreSelect}
          style={{ padding:'20px',marginLeft:'1000px',marginTop:'10px'}}
        >
          {scoreList}
        </select>
      }
      </div>
      
      {report && <ReportViewer json={report} key={getUniqueKey()}/> }
      
    </div>
  )
}

export default ShowReports;