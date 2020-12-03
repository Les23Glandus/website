import React from "react";
import { withRouter, Link } from "react-router-dom";
import {  Row, Col  } from "antd";
import SelectionMini from "./SelectionMini";
  
class SelectionsGrid extends React.Component {

  render() {
    
    return (
        
        <div className="latest-ei-tests">
            <h2>Nos sélections</h2>
            <div>
                <Row gutter={[16,16]}>
                  <Col xs={24} sm={12} md={8} lg={6} xl={6}><SelectionMini/></Col>
                  <Col xs={24} sm={12} md={8} lg={6} xl={6}><SelectionMini/></Col>
                  <Col xs={24} sm={12} md={8} lg={6} xl={6}><SelectionMini/></Col>
                  <Col xs={24} sm={12} md={8} lg={6} xl={6}><SelectionMini/></Col>
                  <Col xs={24} sm={12} md={8} lg={6} xl={6}><SelectionMini/></Col>
                  <Col xs={24} sm={12} md={8} lg={6} xl={6}><SelectionMini/></Col>
                  <Col xs={24} sm={12} md={8} lg={6} xl={6}><SelectionMini/></Col>
                  <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                    <div className="selection-mini">
                      <Link to="/selection">See more...</Link>
                    </div>
                  </Col>
                </Row>
            </div>
        </div>
    )
  }

}


export default withRouter(SelectionsGrid);