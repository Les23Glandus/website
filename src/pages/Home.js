import React from "react";
import { withRouter } from "react-router-dom";
import Carousel from "../components/Carousel";
import LatestsTests from "../components/LatestsTests";
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

          <LatestsTests/>

          <SelectionsGrid/>

          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          <br/>&nbsp;
          
      </div>
    )
  }

}


export default withRouter(Home);