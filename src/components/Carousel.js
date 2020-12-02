import React from "react";
import { withRouter } from "react-router-dom";
import { Carousel as AntCarousel } from 'antd';
  
class Carousel extends React.Component {

  render() {
    const contentStyle = {
        height: '160px',
        color: '#fff',
        lineHeight: '160px',
        textAlign: 'center',
        background: '#364d79',
      };
      
    
    return (
        <div className="home-carousel">
            <AntCarousel autoplay>
                <div>
                <h3 style={contentStyle}>1</h3>
                </div>
                <div>
                <h3 style={contentStyle}>2</h3>
                </div>
                <div>
                <h3 style={contentStyle}>3</h3>
                </div>
                <div>
                <h3 style={contentStyle}>4</h3>
                </div>
            </AntCarousel>
        </div>
    )
  }

}


export default withRouter(Carousel);