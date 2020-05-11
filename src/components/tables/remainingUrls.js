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

const RemainingUrlsTable = (props) => {
  const { classes } = props;
  const [comparedData,setComparedData] = useState({});
  const [keys,setKeys] = useState([]);
  const [open,setOpen] = useState(false);

  useEffect(()=>{
    if(props.data){
      setComparedData(props.data);
      setKeys(Object.keys(props.data.scores));
    }
  },[props])

  function createData(name, description) {
    return { name, description};
  }

  const rows = keys.map(key=>{
    return createData(key,comparedData.scores[key])
  })
  const handleClick = () => {setOpen(!open)}

  return (
    <div>
      <Card className={classes.comapiredTableContainer}>
        <CardActions onClick={handleClick} className={classes.cardActions}>{comparedData.url}</CardActions>
        <Collapse isOpened={open}>
        <CardContent className={classes.cardContents}>
        <TableContainer component={Paper} style={{margin:'10px'}}>
          <Table>
            <TableHead>
                <TableRow>
                  <TableCell align="left" className={classes.boldFonts}>Title</TableCell>
                  <TableCell align="left" className={classes.boldFonts}>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row" align="left">
                      {row.name}
                    </TableCell>
                    <TableCell align="left">{row.description}</TableCell>
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

export default withStyles(styles)(RemainingUrlsTable);


