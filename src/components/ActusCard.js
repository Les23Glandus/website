import React from "react";
import { withRouter } from "react-router-dom";
import Card from "./meta/Card";
import RichText from "./meta/RichText";
  
class ActusCard extends React.Component {

  constructor(props) {
    super(props);
    this.descp = React.createRef();
  }

  componentDidMount() {  
    this.reduceText();
  }
  componentDidUpdate() {  
    this.reduceText();
  }

  reduceText() {
    if( this.descp && this.descp.current ) {
      const maxln = 300;
      let txt = this.descp.current.innerText;
      if( txt ) {
        let after = txt.length > maxln ? "..." : "";
        this.descp.current.innerHTML = txt.substring(0,maxln) + after;
        this.descp.current.title = txt;
      }
    }
  }

  render() {

    let imageUrl;
    if( this.props.details.mini ) {
      if( this.props.details.mini.formats.small ) imageUrl = this.props.details.mini.formats.small.url
      else imageUrl = this.props.details.mini.url;
    }

    let date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(this.props.details.date));
    
    return (
      
      <Card className="actu-card"
          reduce={this.props.reduce ? true : false}
          compact={this.props.compact ? true : false}
          url={"/news/"+this.props.details.uniquepath}
          title={this.props.details.title}
          supTitle={!this.props.reduce && date}
          subTitle={this.props.reduce && date}
          imageUrl={imageUrl}
          imageTitle={this.props.details.description}
          more={<div className="description" ref={this.descp}><RichText>{ this.props.details.description }</RichText></div>}
      
      ></Card>
    )
  }

}


export default withRouter(ActusCard);