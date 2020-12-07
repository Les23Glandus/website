import { Skeleton } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "../components/EscapeCard";

  
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
    
    if( !this.state.loaded ) {
      return (
        <div>
            <h2><Skeleton paragraph={false}/></h2>
            <Skeleton active/>
            
            <div>
              <h2>Les salles</h2>
              <Skeleton active/>
            </div>
        </div>
      )
    } else {
      
      return (
        <div>
            <h2>{this.details.title}</h2>
            {this.details.article}
            
            {
              this.details.escapes.length &&
              <div>
                <h2>Les salles</h2>
                {this.details.escapes.map( n => <EscapeCard key={n.id} enseigne={n.enseigne} escape={n}/>)}
              </div>
            }

        </div>
      )
    }
  }

}


export default withRouter(Selection);