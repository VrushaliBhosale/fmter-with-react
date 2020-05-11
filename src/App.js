import React from 'react';
import './App.css';
import ShowReports from './components/reports'
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import ReportProvider from './services/reports-context'
import CompairReports from './components/reportComparison/index'

function App() {
  return (
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
