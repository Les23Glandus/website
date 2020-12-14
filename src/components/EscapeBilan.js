import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
  
class EscapeBilan extends React.Component {

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false, realisation:null};

  }

  loadEscapes() {
    let strapi = new strapiConnector();
    strapi.getRealisation().then(
      d => {
        this.setState({realisation:d});
      
    }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
  }

  componentDidMount() {
    this.loadEscapes();
  }


  render() {
    
    return (
        
        <div className="bilan-ei-tests">
            {this.state.realisation &&
              <div className="realisation">
                Au cours de nos {this.state.realisation.count} escapes, 
                nous avons sauvé le monde {this.state.realisation.saveWorld} fois et sauvé notre peau {this.state.realisation.saveUs} fois. 
                Nous avons déjoué {this.state.realisation.rituals} rituels sataniques et {this.state.realisation.plan} plans machiavéliques. 
                Nous pouvons mentionner également {this.state.realisation.timeTravels} voyages dans le temps, {this.state.realisation.tresors} trésors trouvés et {this.state.realisation.prisons} séjours derrière les barreaux… bref, 
                nous avons une vie trépidante !
              </div>
            }
        </div>
    )
  }

}


export default withRouter(EscapeBilan);