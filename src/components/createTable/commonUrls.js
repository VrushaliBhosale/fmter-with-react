import React,{useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './style.css'

const CommonUrlsTable = (props) => {
  const [comparedData,setComparedData] = useState({});
  const [keys,setKeys] = useState([]);
  useEffect(()=>{
    if(props.data){
      setComparedData(props.data);
      setKeys(Object.keys(props.data.run1Audits));
    }
  },[props])

  const getScoreDifference = (score) => {
    let msg = '';     
    if(score === 0){
      msg="score is similar (0)"
    }else if(score<0){
      msg=`decreased by ${score*(-1)}`
    }else if(score>0){
      msg=`increased by ${score}`
    }
    return msg;
  }

  function createCompairData(name, run1score, run2score) {
    return { name, run1score, run2score };
  }

  function createSummaryData(name, description) {
    return { name, description};
  }

  const comparisionRows = keys && keys.map(key=>{
    return createCompairData(key,comparedData.run1Audits[key],comparedData.run2Audits[key])
  })

  const summaryRows = keys.map((key)=>{
    return createSummaryData(key,comparedData.diff[key])
  })
  return (
    <div>
    <div style={{fontWeight:'bold'}}>{comparedData.url}</div>
    <TableContainer component={Paper} style={{margin:'10px',width:'70%'}}>
      <Table style={{margin:'10px'}}>
        <TableHead>
          <TableRow>
            <TableCell align="left" className="bold-fonts">Title</TableCell>
            <TableCell align="left" className='bold-fonts'>{comparedData.timeStamp1}</TableCell>
            <TableCell align="left" className='bold-fonts'>{comparedData.timeStamp2}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {comparisionRows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row" align="left" className='bold-fonts'>
                {row.name}
              </TableCell>
              <TableCell align="left">{row.run1score}</TableCell>
              <TableCell align="left">{row.run2score}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <div style={{fontWeight:'bold'}}>Summary</div>
    <TableContainer component={Paper} style={{margin:'10px',width:'70%'}}>
    <Table>
      <TableHead>
          <TableRow>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">Description</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {summaryRows.map((row,index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row" align="left">
                {row.name}
              </TableCell>
              <TableCell align="left">{getScoreDifference(row.description)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    </div>
  )
}

export default CommonUrlsTable;