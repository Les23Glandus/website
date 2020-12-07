import React from "react";
import { withRouter, Link } from "react-router-dom";
import {  Row, Col, Skeleton  } from "antd";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "./EscapeCard";
  
class EscapeLatestsTests extends React.Component {

  lastescapes;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};

  }

  loadEscapes() {
    let strapi = new strapiConnector();
    strapi.getRecentEscapes(3).then(
      list => {
        this.lastescapes = list;
        this.setState({loaded:true});
      }
    ).catch(e => this.setState({error:true}));
  }

  componentDidMount() {
    this.loadEscapes();
  }


  render() {
    
    return (
        
        <div className="latest-ei-tests">
            <h2>Les derniers tests</h2>
            <div>
                {this.lastescapes && 
                  <Row gutter={[16,16]}>
                    {
                      this.lastescapes.map( n => 
                        <Col key={n.id} xs={24} sm={12} md={6} lg={6} xl={6}><EscapeCard escape={n} enseigne={n.enseigne}/></Col>
                      )
                    }
                    <Col xs={24} sm={12} md={6} lg={6} xl={6}>
                        <div className="vignette">
                            <Link to="/escapegame">See more...</Link>
                        </div>
                    </Col>
                  </Row>
                }
                {!this.lastescapes && <Skeleton active title={false} paragraph={true}/>}
            </div>
        </div>
    )
  }

}


export default withRouter(EscapeLatestsTests);