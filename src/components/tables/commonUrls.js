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
import { withStyles } from '@material-ui/core/styles';
const moment = require('moment');

const styles = {
  boldFonts: {
   fontWeight:'bold'
  },
  cardContents: {
    display:'flex',
    flexDirection:'row',
    padding:'15px',
    alignItems:'space-around',
    width:'98%',
    backgroundColor:'#F5F5F5'
  },
  comapiredTableContainer:{
    margin:'10px'
  },
  summaryTableContainer:{
    margin:'10px',
    width:'70%'
  },
  cardActions:{
    padding:'15px'
  }
};

const CommonUrlsTable = (props) => {
  const { classes } = props;
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
      <Card className={classes.comapiredTableContainer}>
      <CardActions onClick={handleClick} className={classes.cardActions}>{comparedData.url}</CardActions>
      <Collapse isOpened={open}>
        <CardContent className={classes.cardContents}>
        <TableContainer component={Paper} className={classes.comapiredTableContainer}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={3} className={classes.boldFonts} align='center'>URL comparision</TableCell>
              </TableRow> 
              <TableRow>
                <TableCell align="left" className={classes.boldFonts}>Title</TableCell>
                <TableCell align="left" className={classes.boldFonts}>{moment(comparedData.timeStamp1).format('DD/MMM/YYYY,h:mm:ss a')}</TableCell>
                <TableCell align="left" className={classes.boldFonts}>{moment(comparedData.timeStamp2).format('DD/MMM/YYYY,h:mm:ss a')}</TableCell>
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

        <TableContainer component={Paper} className={classes.summaryTableContainer}>
        <Table>
          <TableHead>
            <TableRow className={classes.boldFonts}>
               <TableCell colSpan={3} className={classes.boldFonts} align='center'>Summary</TableCell>
            </TableRow>
            <TableRow>
              <TableCell align="left" className={classes.boldFonts}>Title</TableCell>
              <TableCell align="left" className={classes.boldFonts}>Description</TableCell>
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

export default withStyles(styles)(CommonUrlsTable);

