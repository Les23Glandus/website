import React from "react";
import { withRouter } from "react-router-dom";
import ActusGrid from "../components/ActusGrid";
import Carousel from "../components/Carousel";
import EscapeBilan from "../components/EscapeBilan";
import EscapeLatestsTests from "../components/EscapeLatestsTests";
import Group from "../components/Group";
import SelectionsGrid from "../components/SelectionsGrid";
import "../css/home.scss";

  
class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div className="home">
          <Carousel/>

          <div className="main-content-page">
            <h2>Expériences Immersives</h2>
            <EscapeBilan/>
            <EscapeLatestsTests/>

            <SelectionsGrid/>

            
            <h2>Notre actualité</h2>
            <ActusGrid/>
          </div>
          
          <Group/>
      </div>
    )
  }

}


export default withRouter(Home);