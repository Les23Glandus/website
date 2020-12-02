import React from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';

class App extends React.Component {
  render() {
    return (
      <Router>
        <Header/> 
        <div className="main-content">  
        <Switch>
            <Route exact path="/">
              <Home/>
            </Route>
        </Switch>
        </div>
        <Footer/>
      </Router>
    );
  }
}

export default App;
