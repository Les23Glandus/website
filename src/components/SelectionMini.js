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
    
    return (
      
      <Card className="selection-card"
          reduce={this.props.reduce ? true : false}
          url={"/selections/"+this.props.details.uniquepath}
          title={this.props.details.title}
          subTitle={this.props.details.description}
          supTitle={""}
          imageUrl={imageUrl}
          imageTitle={this.props.details.description}
          more={""}
      
      ></Card>
    )
  }

}


export default withRouter(SelectionMini);