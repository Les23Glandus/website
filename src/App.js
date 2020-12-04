import React from 'react';
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import { Layout} from 'antd';
import Footer from './components/Footer';
import Header from './components/Header';
import Home from './pages/Home';
import { Header as AntHeader, Footer as AntFooter, Content as AntContent } from 'antd/lib/layout/layout';
import Enseigne from './pages/Enseigne';
import Escape from './pages/Escape';
import Page404 from './pages/Page404';
import Search from './pages/Search';

class App extends React.Component {
  render() {
    return (
      <Router>

        <Layout>
          <AntHeader><Header/></AntHeader>
          <AntContent>
            <Switch>
                <Route exact path="/">
                  <Home/>
                </Route>
                <Route exact path="/article">
                  <Escape/>
                </Route>
                <Route exact path="/enseigne">
                  <Enseigne/>
                </Route>
                <Route exact path="/escapegame/:enseigne/:escape">
                  <Escape/>
                </Route>
                <Route exact path="/escapegame/:enseigne">
                  <Enseigne/>
                </Route>
                <Route exact path="/escapegame">
                  <Search/>
                </Route>
                <Route>
                  <Page404/>
                </Route>
            </Switch>
          </AntContent>
          <AntFooter><Footer/></AntFooter>
        </Layout>
        
      </Router>
    );
  }
}

export default App;
