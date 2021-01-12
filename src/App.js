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
                  <Route path="/about">
                    <APropos/>
                  </Route>

                  <Redirect from='/entreprise/:enseigne' to='/escapegame/:enseigne'/>
                  <Redirect from='/groupe' to='/about'/>
                  <Redirect from='/author/:x' to='/'/>
                  <Redirect from='/categorie/:x' to='/escapegame'/>
                  <Redirect from='/badge/:x' to='/escapegame'/>
                  <Redirect from='/pays/:x' to='/escapegame'/>
                  <Redirect from='/escape-room-le-jeu' to='/jeux/escape-room-le-jeu'/>
                  <Redirect from='/sorties-a-venir-ete-2020' to='/news/sorties-a-venir-ete-2020'/>                  
                  <Redirect from='/unlock-star-wars' to='/jeux/unlock-star-wars'/>
                  <Redirect from='/detective' to='/jeux/detective'/>                 
                  <Redirect from='/escape_tag/:x' to='/escapegame'/>
                  <Redirect from='/les-glandus-dor-2019' to='/selections/les-glandus-d-or-2019'/>
                  <Redirect from='/exit' to='/jeux'/>
                  <Redirect from='/et-sinon' to='/jeux'/>

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
