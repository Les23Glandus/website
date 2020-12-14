import React from "react";
import { withRouter } from "react-router-dom";
import EscapeArticle from "../components/EscapeArticle";
import Page500 from "./Page500";

  
class Escape extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }


  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
    return (
      <div>
        <EscapeArticle  key={this.props.match.params.escape} escapeRef={this.props.match.params.escape}/>
      </div>
    )
  }

}


export default withRouter(Escape);