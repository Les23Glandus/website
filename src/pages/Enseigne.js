import React from "react";
import { withRouter } from "react-router-dom";
import EnseigneArticle from "../components/EnseigneArticle";

  
class Enseigne extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.state.enseigneRef = this.props.match.params.enseigne;
  }

  render() {
    
    return (
      <div>
        <EnseigneArticle enseigneRef={this.state.enseigneRef}/>
      </div>
    )
  }

}


export default withRouter(Enseigne);