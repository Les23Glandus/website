import React from "react";
import { withRouter, Link } from "react-router-dom";
import {  Row, Col  } from "antd";
import Vignette from "./Vignette";
  
class LatestsTests extends React.Component {

  render() {
    
    return (
        
        <div className="latest-ei-tests">
            <h2>Les derniers tests</h2>
            <div>
                <Row gutter={[16,16]}>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}><Vignette/></Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}><Vignette/></Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}><Vignette/></Col>
                  <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                      <div className="vignette">
                          <Link to="/search">See more...</Link>
                      </div>
                  </Col>
                </Row>
            </div>
        </div>
    )
  }

}


export default withRouter(LatestsTests);