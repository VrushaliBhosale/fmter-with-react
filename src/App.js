import React from 'react';
import './App.css';
import ShowReports from './components/showReports'

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
    <ShowReports/>
  );
}

export default App;
