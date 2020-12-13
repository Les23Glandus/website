import React from "react";
import { withRouter, Link } from "react-router-dom";
import {  Row, Col, Skeleton  } from "antd";
import strapiConnector from "../class/strapiConnector";
import ActusCard from "./ActusCard";
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
    new strapiConnector().getRecentActus(7).then(d => { 
      this.details = d;
      this.setState({loaded:true, error:false});
    } ).catch();
  }

  render() {
    
    return (
        
        <div className="actus-list">
            <h3>Actus Glandus</h3>
            <div>
                {this.state.loaded === false && <Skeleton active/>}
                {this.state.loaded && 
                  <div className="flexgrid grid-actus">

                    {this.details.map( n => <ActusCard details={n} reduce/> )}
                    {
                      
                        <Card className="seemore-card"
                          reduce={true}
                          url={"/escapegames"}
                          bigText={"Toutes nos actus"}
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