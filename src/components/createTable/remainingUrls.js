import React,{useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const RemainingUrlsTable = (props) => {
  const [comparedData,setComparedData] = useState({});
  const [keys,setKeys] = useState([]);
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

  return (
    <div>
    <div style={{fontWeight:'bold'}}>{comparedData.url}</div>

    <TableContainer component={Paper} style={{margin:'10px',width:'70%'}}>
    <Table>
      <TableHead>
          <TableRow>
            <TableCell align="left">Title</TableCell>
            <TableCell align="left">Description</TableCell>
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
    </div>
  )
}

export default RemainingUrlsTable;

