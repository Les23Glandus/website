import React from "react";
import { withRouter } from "react-router-dom";
import { Carousel as AntCarousel } from 'antd';
import strapiConnector from "../class/strapiConnector";
import "../css/carousel.scss";
import TopIllustration from "./meta/TopIllustration";
import {isMobile} from 'react-device-detect';
  
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
    }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
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

                        let imgUrl = n.image.url;
                        if( isMobile ) {
                            if( n.image.formats && n.image.formats.medium ) {
                                imgUrl = n.image.formats.medium.url;
                            }
                        }

                        const contentStyle = {
                            backgroundImage: 'url('+imgUrl+')'
                          };
                        const div = (<div className='text'><div><span>{n.title}</span></div></div>);
                    return (
                        <div key={n.id} title={n.description} className="carousel">
                            { n.link && <a href={n.link}>{div}</a>}
                            { !n.link && div }
                            <div className="illustration" style={contentStyle}></div>
                        </div>
                    )
                    })
                }
                {!this.state.loaded && 
                        <div><TopIllustration/></div>}
            </AntCarousel>
        </div>
    )
  }

}


export default withRouter(Carousel);