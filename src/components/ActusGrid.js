import React from "react";
import { withRouter, Link } from "react-router-dom";
import {  Row, Col, Skeleton  } from "antd";
import strapiConnector from "../class/strapiConnector";
import ActusCard from "./ActusCard";
  
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
            <h2>Actus Glandus</h2>
            <div>
                {this.state.loaded === false && <Skeleton active/>}
                {this.state.loaded && 
                  <Row gutter={[16,16]}>
                    {this.details.map( n => <Col xs={24} sm={12} md={8} lg={6} xl={6} key={n.id}><ActusCard details={n} reduce/></Col> )}
                    {
                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <div className="actus-mini">
                          <Link to="/news">See more...</Link>
                        </div>
                      </Col>
                    }
                  </Row>
                }
            </div>
        </div>
    )
  }

}


export default withRouter(SelectionsGrid);