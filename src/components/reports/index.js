import React, { useEffect, useState } from 'react';
import ReportViewer from 'react-lighthouse-viewer';
import {getAllRunIds, getLastReport, getAllProjects} from '../../services/api-methods';
import './style.css';
import { Link } from 'react-router-dom';
var Loader = require('react-loader');

const ShowReports = () => {
  const [allProjects,setAllProjects] = useState([]);
  const [activeProject,setActiveProject] = useState();
  const [allRuns,setAllRuns] = useState([]);
  const [allScores,setAllScores] = useState([]);
  const [report,setReport] = useState();
  const [selectedIndex,setSelectedIndex] = useState();
  const [initialRun,setInitialRun] = useState();  
  const [reportlLoader,setReportLoader] = useState(true);
  const [loader,setLoader] = useState(true);

  const resloveRunPromies = async() =>{
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
  const resloveProjectPromies = async() =>{
    let data = await getProjects();
    console.log("data :",data)
    return data;
  }
  async function getProjects(){
   return  await getAllProjects()
    .then(async projects=>{
      console.log("in func :",projects)
      return projects;
    })
    .catch(function(error){
      console.log("Error :",error);
    });
  }
  useEffect(()=>{
    setLoader(false);
    let isSubscribed = true;
    if (isSubscribed) {
      resloveProjectPromies().then(projects=>{
        if(projects.length>0){
        let lastproject = projects[projects.length-1];
        console.log(lastproject.name)
        setAllProjects(projects)
        setActiveProject(projects.length-1)
        setAllRuns(lastproject.runs);
        setAllScores(lastproject.runs[lastproject.runs.length-1].urls);
        setInitialRun(lastproject.runs.length-1);
        setInitialReport(lastproject.runs[lastproject.runs.length-1].urls[0].id);
        setLoader(true);
      }else{setLoader(true)}})
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

  const handleProjectSelect = (event) => {
    const {value} = event.target;
    let activeRun = allProjects[value].runs;
    let activeScore = activeRun[0].urls;
    setActiveProject(value);
    setAllRuns(activeRun);
    setAllScores(activeScore)
    setInitialReport(activeScore[0].id)
  }

  const handleRunSelect = async(event) => {
    const {value} = event.target;
    setInitialRun(value);
    await allRuns[value].urls[0] && setInitialReport(allRuns[value].urls[0].id);  
    await setSelectedIndex(allRuns[value].urls[0].id);
    await setAllScores(allRuns[value].urls);
  }

  const handleScoreSelect = (event) => {
    const {value} = event.target;
    setSelectedIndex(value);
    setInitialReport(value);
  }

  const getUniqueKey = () => {
    return Date.now();
  }

  const projectList = 
  allProjects&&allProjects.map((project,index)=>{
    return (
    <option value={index} key={index}>{project.name}</option>
    )
  })

  const runList = 
  allRuns&&allRuns.map((run,index)=>{
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
    <Loader loaded={loader}>
    { (!allProjects.length && !allRuns.length || !allScores.length)&&<h3>Runs and scores are empty</h3> }
    {
      allRuns.length>0 && allScores.length>0 && allProjects.length>0 && 
      <div style={{backgroundColor:'#000000'}}>
        <div className="name-input-wrapper">
          <div className="project-name">{activeProject && allProjects[activeProject].name}</div>
          <div className="report-inputs-viewer">
            <div className="report-imput-elem-spacing">
              <select 
                value={activeProject}
                onChange={handleProjectSelect} 
                > 
                {projectList}
              </select>
            </div>
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
                style={{ textOverflow: "ellipsis",overflow: "hidden"}}
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
        </div>
           <Loader loaded={reportlLoader}>
            {report && <ReportViewer json={report} key={getUniqueKey()}/> }
          </Loader>
         
      </div> 
    }
    </Loader>
  </div>
  )
}

export default ShowReports;