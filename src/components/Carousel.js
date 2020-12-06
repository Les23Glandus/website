import React from "react";
import { withRouter } from "react-router-dom";
import { Carousel as AntCarousel } from 'antd';
import strapiConnector from "../class/strapiConnector";
  
class Carousel extends React.Component {

details;

constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
}

loadDetails() {
    new strapiConnector().getCarousel().then( list => {
        this.details = list;
        this.setState({loaded:true});
    }).catch(e => this.setState({error:true}));
}

componentDidMount() {
    this.loadDetails();
}

  render() {      
    
    return (
        <div className="home-carousel">
            <AntCarousel autoplay>
                {this.state.loaded && 
                    this.details.map( n => {
                        const contentStyle = {
                            height: '160px',
                            color: '#fff',
                            textAlign: 'center',
                            background: 'url('+n.image.url+') 50% 50% #364d79',
                            backgroundSize: 'cover'
                          };
                    return (
                        <div key={n.id}>
                            <div style={contentStyle}>
                                <span>{n.title}</span>
                                <p>{new Intl.DateTimeFormat('fr-FR').format(new Date(n.date))}</p>
                                <span>{n.description}</span>
                            </div>
                        </div>
                    )
                    })
                }
                {!this.state.loaded && 
                        <div style={{height: '160px', color: '#fff', textAlign: 'center',
                         background: 'grey'}} >
                            <div>
                                <span>Loading...</span>
                            </div>
                        </div>}
            </AntCarousel>
        </div>
    )
  }

}


export default withRouter(Carousel);