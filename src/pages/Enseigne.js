import React from "react";
import { withRouter } from "react-router-dom";
import ArticleEnseigne from "../components/ArticleEnseigne";

  
class Enseigne extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div>
        <ArticleEnseigne/>
      </div>
    )
  }

}


export default withRouter(Enseigne);