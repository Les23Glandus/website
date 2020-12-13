import React from "react";
import { withRouter } from "react-router-dom";
import Card from "./meta/Card";
  
class SelectionMini extends React.Component {

  render() {

    let imageUrl;
    if( this.props.details.mini ) {
      if( this.props.details.mini.formats.small ) imageUrl = this.props.details.mini.formats.small.url
      else  imageUrl = this.props.details.mini.url;
    }
    
    let reg = /_(.+)$/;
    let color;
    let m = reg.exec( this.props.details.color);
    if( m ) {
      color = "#" + m[1];
    }

    return (
      
      <Card className="selection-card"
          reduce={this.props.reduce ? true : false}
          url={"/selections/"+this.props.details.uniquepath}
          bigText={this.props.details.title}
          subTitle={""}
          supTitle={""}
          imageUrl={imageUrl}
          imageTitle={this.props.details.description}
          more={""}
          color={color}
      
      ></Card>
    )
  }

}


export default withRouter(SelectionMini);