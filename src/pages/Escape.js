import React from "react";
import { withRouter } from "react-router-dom";
import ArticleEscape from "../components/ArticleEscape";

  
class Escape extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.state.enseigneRef = this.props.match.params.enseigne;
    this.state.escapeRef = this.props.match.params.escape;
  }

  render() {
    //escapeID={1}
    return (
      <div>
        <ArticleEscape  key={Math.random()} keyS={this.state.escapeRef} escapeRef={this.state.escapeRef}/>
      </div>
    )
  }

}


export default withRouter(Escape);