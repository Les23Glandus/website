import React from "react";
import { withRouter } from "react-router-dom";
import Carousel from "../components/Carousel";

  
class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div>
          <Carousel/>

          Here the home content !
      </div>
    )
  }

}


export default withRouter(Home);