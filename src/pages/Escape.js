import React from "react";
import { withRouter } from "react-router-dom";
import ArticleEscape from "../components/ArticleEscape";

  
class Escape extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div>
        <ArticleEscape escapeID={3}/>
      </div>
    )
  }

}


export default withRouter(Escape);