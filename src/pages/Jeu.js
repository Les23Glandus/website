import React from "react";
import { withRouter } from "react-router-dom";
import JeuxArticle from "../components/JeuxArticle";
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
        <JeuxArticle  key={this.props.match.params.jeu} jeuRef={this.props.match.params.jeu}
         onError={()=>this.setState({error:true})}/>
      </div>
    )
  }

}


export default withRouter(Escape);