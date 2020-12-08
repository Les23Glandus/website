import React from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Enseigne from './pages/Enseigne';
import Escape from './pages/Escape';
import Page404 from './pages/Page404';
import Search from './pages/Search';
import Selections from './pages/Selections';
import Selection from './pages/Selection';
import News from './pages/News';
import Actu from './pages/Actu';
import HtmlHead from './components/HtmlHead';

class App extends React.Component {
  render() {
    return (
      <Router>

        <div>
          
          <HtmlHead/>
          <div><Header/></div>
          <div>
            <Switch>
                <Route exact path="/">
                  <Home/>
                </Route>
                <Route exact path="/escapegame/:enseigne/:escape">
                  <Escape/>
                </Route>
                <Route exact path="/escapegame/:enseigne">
                  <Enseigne/>
                </Route>
                <Route path="/escapegame">
                  <Search/>
                </Route>
                <Route exact path="/selections/:selection">
                  <Selection/>
                </Route>
                <Route path="/selections">
                  <Selections/>
                </Route>
                <Route exact path="/news/:news">
                  <Actu/>
                </Route>
                <Route path="/news">
                  <News/>
                </Route>
                <Route>
                  <Page404/>
                </Route>
            </Switch>
          </div>
          <div><Footer/></div>
        </div>
        
      </Router>
    );
  }
}

export default App;
