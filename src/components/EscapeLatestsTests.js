import React from "react";
import { withRouter, Link } from "react-router-dom";
import {  Row, Col, Skeleton  } from "antd";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "./EscapeCard";
  
class EscapeLatestsTests extends React.Component {

  lastescapes;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false, realisation:null};

  }

  loadEscapes() {
    let strapi = new strapiConnector();
    strapi.getRecentEscapes(3).then(
      list => {
        this.lastescapes = list;
        this.setState({loaded:true});
      }
    ).catch(e => this.setState({error:true}));

    strapi.getRealisation().then(
      d => {
        this.setState({realisation:d});
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
            {this.state.realisation &&
              <div>
                Au cours de nos {this.state.realisation.count} escapes, 
                nous avons sauvé le monde {this.state.realisation.saveWorld} fois et sauvé notre peau {this.state.realisation.saveUs} fois. 
                Nous avons déjoué {this.state.realisation.rituals} rituels sataniques et {this.state.realisation.plan} plans machiavéliques. 
                Nous pouvons mentionner également {this.state.realisation.timeTravels} voyages dans le temps, {this.state.realisation.tresors} trésors trouvés et {this.state.realisation.prisons} séjours derrière les barreaux… bref, 
                nous avons une vie trépidante !
              </div>
            }
            <div>
                {this.lastescapes && 
                  <Row gutter={[16,16]}>
                    {
                      this.lastescapes.map( n => 
                        <Col key={n.id} xs={24} sm={12} md={6} lg={6} xl={6}><EscapeCard reduce escape={n} enseigne={n.enseigne}/></Col>
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