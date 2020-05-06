import React,{useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Collapse} from 'react-collapse';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import './style.css'

const CommonUrlsTable = (props) => {
  const [comparedData,setComparedData] = useState({});
  const [keys,setKeys] = useState([]);
  const [open,setOpen] = useState(false);
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
      msg=`increased by ${score*(-1)}`
    }else if(score>0){
      msg=`decreased by ${score}`
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

  const handleClick = () => {setOpen(!open)}
  return (
    <div>
      <Card style={{margin:'10px'}}>
      <CardActions onClick={handleClick} style={{padding:'15px'}}>{comparedData.url}</CardActions>
      <Collapse isOpened={open}>
        <CardContent style={{display:'flex',flexDirection:'row',padding:'15px',alignItems:'space-around',width:'98%',backgroundColor:'#F5F5F5'}}>
        <TableContainer component={Paper} style={{margin:'10px'}}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} style={{fontWeight:'bold'}} align='center'>URL comparision</TableCell>
              </TableRow> 
              <TableRow>
                <TableCell align="left">Title</TableCell>
                <TableCell align="left">{comparedData.timeStamp1}</TableCell>
                <TableCell align="left">{comparedData.timeStamp2}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {comparisionRows.map((row) => (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row" align="left" className='bold-fonts'>
                    {row.name}
                  </TableCell>
                  <TableCell align="center">{row.run1score}</TableCell>
                  <TableCell align="center">{row.run2score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TableContainer component={Paper} style={{margin:'10px',width:'70%'}}>
        <Table>
          <TableHead>
            <TableRow style={{fontWeight:'bold'}}>
               <TableCell colSpan={3} style={{fontWeight:'bold'}} align='center'>Summary</TableCell>
            </TableRow>
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
        </CardContent>
      </Collapse>
    </Card>
   </div>
  )
}

export default CommonUrlsTable;