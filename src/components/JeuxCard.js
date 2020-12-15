import React from "react";
import { withRouter } from "react-router-dom";
import "../css/jeuxcard.scss";
import Card from "./meta/Card";
import RichText from "./meta/RichText";
  
class JeuxCard extends React.Component {

  render() {

    let imageUrl;
    if( this.props.jeux.mini ) {
      if( this.props.jeux.mini.formats.small ) imageUrl = this.props.jeux.mini.formats.small.url
      else  imageUrl = this.props.jeux.mini.url;
    }
    
    return (

        <Card className="jeux-card"
            reduce={this.props.reduce ? true : false}
            url={"/jeux/"+this.props.jeux.uniquepath}
            title={<span>{this.props.jeux.name}</span>}
            subTitle={this.props.jeux.jeux_types && this.props.jeux.jeux_types.map(n=>n.name).join(", ")}
            supTitle={""}
            imageUrl={imageUrl}
            imageTitle={this.props.jeux.description}
            more={<div className="description"><RichText>{ this.props.jeux.description }</RichText></div>}
        >
              {
                this.props.date &&
                <p className="date">{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.props.jeux.date))}</p>
              }
        </Card>

    )
  }

}


export default withRouter(JeuxCard);