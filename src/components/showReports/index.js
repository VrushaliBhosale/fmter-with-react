import React, { useEffect, useState } from 'react';
import ReportViewer from 'react-lighthouse-viewer';
import axios from 'axios';

const ShowReports = () => {
  const url="https://cart-api-ts.herokuapp.com/scores"
  // const url="http://localhost:3002/scores";
  const [allScores,setAllScores] = useState([]);
  const [report,setReport] = useState();
  const [selectedVal,setSelectedVal] = useState();
  const [data,setData] = useState();
  useEffect(()=>{
    async function getAUdits(){
      await axios.get(url)
      .then(function(response){
        console.log("data :",response.data.message);
        setAllScores(response.data.message);
      })
      .catch(function(error){
          console.log("Error :",error);
      });
    }
  getAUdits();
  },[])

  useEffect(()=>{
    const reportData = report && <ReportViewer json={report} /> ;
    // console.log("reposrts :",reportData);
    setData(reportData);
  },[report])

  const [count,setCount] = useState();
  const handleClick = async(event) => {
    setCount(event.target.value)

    let {value} = event.target;
    console.log("value :",event.target.value);
    await setSelectedVal(value);
    let report = value && JSON.parse(allScores[value].score);
    setReport(report);
  //  await allScores.map(async score=>{
  //     if(score._id === selectedVal){
  //      await setReport(JSON.parse(score.score));
  //       console.log("state :",report);
  //     }
  //   })
  }

  const showReport = () => {
    return (
    <div>
      <ReportViewer json={report} /> 
    </div>
    )
  }
 
  return (
    <div>
      Hiii
      <div>
        <input list="scores" name="score" onSelect={handleClick} />
          <datalist id="scores">
            {
              allScores && allScores.map((data,index)=>{
                return(
                  <option value={index} key={index}/>
                )
              })
            }
          </datalist>

      </div>
         { report && <h3>{count}</h3>}
          {/* {report && data} */}
      {report && <ReportViewer json={report} /> }
      
    </div>
  )
}

export default ShowReports;