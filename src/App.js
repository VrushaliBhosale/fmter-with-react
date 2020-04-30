import React from 'react';
import './App.css';
import ShowReports from './components/showReports'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReportProvider from './services/reports-context'
import CompairReports from './components/compairReports'

function App() {
  
  return (
    // <Router>
    //   <Switch>
    //       <div>
    //       <Route exact path="/"
    //         render={props => ( <ShowReports/>)}
    //       />
    //       {/* <Route path="/compair"
    //         render={props => ( <CompairReports/>)}
    //       /> */}
    //      </div>
    //   </Switch>
    // </Router>
    <ReportProvider>
      <Router>
        <Route exact path='/' children={<ShowReports/>}/>
        <Route exact path='/compare' children={<CompairReports />} />
        <Switch>
        <Route path={`/compare/:run1/:run2`} children={<CompairReports />} />
        </Switch>
      </Router>
    </ReportProvider> 
  );
}

export default App;
