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
      
      <Card className="actu-card"
          reduce={this.props.reduce ? true : false}
          url={"/news/"+this.props.details.uniquepath}
          title={this.props.details.title}
          subTitle={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.props.details.date))}
          supTitle={""}
          imageUrl={imageUrl}
          imageTitle={this.props.details.description}
          more={<div className="description">{ this.props.details.description }</div>}
      
      ></Card>
    )
  }

}


export default withRouter(SelectionMini);