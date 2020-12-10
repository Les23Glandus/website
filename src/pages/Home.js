import React from "react";
import { withRouter } from "react-router-dom";
import ActusGrid from "../components/ActusGrid";
import Carousel from "../components/Carousel";
import EscapeLatestsTests from "../components/EscapeLatestsTests";
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

          <EscapeLatestsTests/>

          <SelectionsGrid/>

          <ActusGrid/>
          

          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
          <br/>
      </div>
    )
  }

}


export default withRouter(Home);