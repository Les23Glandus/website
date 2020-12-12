import React from "react";
import { withRouter, Link } from "react-router-dom";
import {  Row, Col, Skeleton  } from "antd";
import SelectionMini from "./SelectionMini";
import strapiConnector from "../class/strapiConnector";
  
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
            <h2>Nos sélections</h2>
            <div>
                {this.state.loaded === false && <Skeleton active/>}
                {this.state.loaded && 
                  <Row gutter={[16,16]}>
                    {!this.props.showAll && this.details.Selections.map( n => <Col xs={24} sm={12} md={8} lg={6} xl={6} key={n.id}><SelectionMini details={n.selection} reduce/></Col> )}
                    {this.props.showAll && this.details.map( n => <Col xs={24} sm={12} md={8} lg={6} xl={6} key={n.id}><SelectionMini details={n} reduce/></Col> )}
                    {!this.props.showAll &&
                      <Col xs={24} sm={12} md={8} lg={6} xl={6}>
                        <div className="selection-mini">
                          <Link to="/selections">See more...</Link>
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