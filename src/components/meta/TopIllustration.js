import React from "react";
import { withRouter } from "react-router-dom";
import "../../css/meta_topillustration.scss";  

class TopIllustration extends React.Component {

  render() {

    let rd = Math.floor(Math.random() * 12) + 1;

    let imageUrl = process.env.PUBLIC_URL + "/patterns/Pattern"+(rd<10?"0":"")+rd+".svg";
    
    return (
        <div className="top-illustration" style={{backgroundImage:`url(${imageUrl})`}}/>
    )
  }

}

export default withRouter(TopIllustration);