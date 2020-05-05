import React,{useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const RemainingUrlsTable = (props) => {
  const [comparedData,setComparedData] = useState({});
  const [keys,setKeys] = useState([]);
  useEffect(()=>{
    if(props.data){
      setComparedData(props.data);
      setKeys(Object.keys(props.data.scores));
    }
  },[props])

  const [expanded, setExpanded] = React.useState(false);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  function createData(name, description) {
    return { name, description};
  }

  const rows = keys.map(key=>{
    return createData(key,comparedData.scores[key])
  })

  return (
    <div>
      <ExpansionPanel expanded={expanded === 'panel1'} onChange={handleChange('panel1')} style={{margin:'10px'}}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography>url : </Typography>
          <Typography>{comparedData.url}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{backgroundColor:'#F5F5F5'}}>
          <Typography style={{display:'flex',flexDirection:'row',margin:'10px',alignItems:'space-around',width:'100%'}}>
            <TableContainer component={Paper}>
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
          </Typography>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    </div>
  )
}

export default RemainingUrlsTable;

