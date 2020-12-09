import React from "react";
import { withRouter } from "react-router-dom";
import Carousel from "../components/Carousel";
import EscapeLatestsTests from "../components/EscapeLatestsTests";
import SelectionsGrid from "../components/SelectionsGrid";

  
class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div>
          <Carousel/>

          <EscapeLatestsTests/>

          <SelectionsGrid/>
          

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