import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import SelectionCompo from "../components/Selection";
import Page500 from "./Page500";

  
class Selection extends React.Component {

  details = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
  }

  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
    return (
      <div>
        <SelectionCompo selectionRef={this.props.match.params.selection}
         onError={()=>this.setState({error:true})}/>
      </div>
    );
  }

}


export default withRouter(Selection);