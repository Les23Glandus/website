import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import SelectionCompo from "../components/Selection";

  
class Selection extends React.Component {

  details = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
  }


  loadDetails() {  
    new strapiConnector().getSelectionByRef(this.props.selectionRef).then( d => {
        this.details = d;
        this.loading = false;
        this.setState({loaded:true, uref:this.details.uniquepath});
    }).catch( e => {
      this.loading = false;
      this.setState({error:true});
    });
  }

  componentDidMount() {
    this.loadDetails();
  }

  render() {
    return (
      <div>
        <SelectionCompo selectionRef={this.props.match.params.selection}/>
      </div>
    );
  }

}


export default withRouter(Selection);