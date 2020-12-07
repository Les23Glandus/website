import React from "react";
import { withRouter } from "react-router-dom";
import EscapeArticle from "../components/EscapeArticle";

  
class Escape extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    return (
      <div>
        <EscapeArticle  key={this.props.match.params.escape} escapeRef={this.props.match.params.escape}/>
      </div>
    )
  }

}


export default withRouter(Escape);