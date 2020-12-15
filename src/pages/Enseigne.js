import React from "react";
import { withRouter } from "react-router-dom";
import EnseigneArticle from "../components/EnseigneArticle";
import Page500 from "./Page500";

  
class Enseigne extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};

    this.state.enseigneRef = this.props.match.params.enseigne;
  }

  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
    
    return (
      <div className="enseigne-main-container">
        <EnseigneArticle enseigneRef={this.state.enseigneRef} updathead={true}
         onError={()=>this.setState({error:true})}/>
      </div>
    )
  }

}


export default withRouter(Enseigne);