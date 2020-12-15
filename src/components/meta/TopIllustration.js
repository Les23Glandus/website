import React from "react";
import { withRouter } from "react-router-dom";
import "../../css/meta_topillustration.scss";  

class TopIllustration extends React.Component {

  
  constructor(props) {
    super(props);
    let rd = Math.floor(Math.random() * 12) + 1;
    this.imageUrl = process.env.PUBLIC_URL + "/patterns/Pattern"+(rd<10?"0":"")+rd+".svg";

  }

  render() {


    
    return (
        <div className="top-illustration" style={{backgroundImage:`url(${this.imageUrl})`}}/>
    )
  }

}

export default withRouter(TopIllustration);