import React from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import Enseigne from './pages/Enseigne';
import Escape from './pages/Escape';
import Page404 from './pages/Page404';
import Browse from './pages/Browse';
import Selections from './pages/Selections';
import Selection from './pages/Selection';
import News from './pages/News';
import Actu from './pages/Actu';
import HtmlHead from './components/HtmlHead';
import APropos from './pages/APropos';
import ScrollToTop from './components/ScrollToTop';
import Jeu from './pages/Jeu';
import Jeux from './pages/Jeux';
import Search from './pages/Search';
import AllEnseigne from './pages/AllEnseigne';

class App extends React.Component {
  render() {
    return (
      <Router>
        <ScrollToTop>
          <div>
            <HtmlHead/>
            <div><Header/></div>
            <div>
              <Switch>
                  <Route exact path="/">
                    <Home/>
                  </Route>
                  <Route exact path="/entreprise/">
                    <AllEnseigne/>
                  </Route>
                  <Route exact path="/escapegame/:enseigne/:escape">
                    <Escape/>
                  </Route>
                  <Route exact path="/escapegame/:enseigne">
                    <Enseigne/>
                  </Route>
                  <Redirect from='/entreprise/:enseigne' to='/escapegame/:enseigne'/>
                  <Route path="/escapegame">
                    <Browse/>
                  </Route>
                  <Route exact path="/selections/:selection">
                    <Selection/>
                  </Route>
                  <Route path="/selections">
                    <Selections/>
                  </Route>
                  <Route exact path="/jeux/:jeu">
                    <Jeu/>
                  </Route>
                  <Redirect from='/et-sinon' to='/jeux'/>
                  <Route path="/jeux">
                    <Jeux/>
                  </Route>
                  <Route exact path="/news/:news">
                    <Actu/>
                  </Route>
                  <Route path="/news">
                    <News/>
                  </Route>
                  <Route path="/search">
                    <Search/>
                  </Route>
                  <Redirect from='/groupe' to='/about'/>
                  <Route path="/about">
                    <APropos/>
                  </Route>
                  <Route status={404} >
                    <Page404/>
                  </Route>
              </Switch>
            </div>
            <div><Footer/></div>
          </div>
        </ScrollToTop>
        
      </Router>
    );
  }
}

export default App;
