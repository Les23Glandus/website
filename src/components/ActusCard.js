import React from "react";
import { withRouter } from "react-router-dom";
import Card from "./meta/Card";
import RichText from "./meta/RichText";
  
class ActusCard extends React.Component {

  render() {

    let imageUrl;
    if( this.props.details.mini ) {
      if( this.props.details.mini.formats.small ) imageUrl = this.props.details.mini.formats.small.url
      else imageUrl = this.props.details.mini.url;
    }
    
    return (
      
      <Card className="actu-card"
          reduce={this.props.reduce ? true : false}
          compact={this.props.compact ? true : false}
          url={"/news/"+this.props.details.uniquepath}
          title={this.props.details.title}
          subTitle={new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.props.details.date))}
          supTitle={""}
          imageUrl={imageUrl}
          imageTitle={this.props.details.description}
          more={<div className="description"><RichText>{ this.props.details.description }</RichText></div>}
      
      ></Card>
    )
  }

}


export default withRouter(ActusCard);