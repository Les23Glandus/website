import React from "react";
import { withRouter, Link } from "react-router-dom";
import {  Row, Col, Skeleton  } from "antd";
import SelectionMini from "./SelectionMini";
import strapiConnector from "../class/strapiConnector";
import Card from "./meta/Card";
  
class SelectionsGrid extends React.Component {

  details;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    if( this.props.showAll ) {
      new strapiConnector().getSelections().then(d => { 
        this.details = d.sort((a,b) => (b.title > a.title) ? -1 : 0 );
        this.setState({loaded:true, error:false});
      } ).catch();
    } else {
      new strapiConnector().getChoixSelection().then(d => { 
        this.details = d;
        this.setState({loaded:true, error:false});
      } ).catch();
    }

  }

  render() {
    
    return (
        
        <div className="selections-list">
            <h3>Nos sélections</h3>
            <div>
                {this.state.loaded === false && <Skeleton active/>}
                {this.state.loaded && 
                  
                  <div className="flexgrid grid-actus">
                    {!this.props.showAll && this.details.Selections.map( n => <SelectionMini details={n.selection} reduce/> )}
                    {this.props.showAll && this.details.map( n => <SelectionMini details={n} reduce/> )}
                    {!this.props.showAll &&
                        <Card className="seemore-card"
                            reduce={true}
                            url={"/selections"}
                            bigText={"Toutes nos sélections"}
                            subTitle={""}
                            supTitle={""}
                            imageUrl={null}
                            imageTitle={""}
                            more={""}
                            color={null}
                        
                        ></Card>
                    }
                  </div>
                }
            </div>
        </div>
    )
  }

}


export default withRouter(SelectionsGrid);