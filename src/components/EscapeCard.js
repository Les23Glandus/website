import React from "react";
import { withRouter } from "react-router-dom";
import "../css/escapecard.scss";
import { Tag } from "antd";
import Card from "./meta/Card";
import Note from "./meta/Note";
import RichText from "./meta/RichText";
import showdown from "showdown";
  
class EscapeCard extends React.Component {

  constructor(props) {
    super(props);
    this.descp = React.createRef();

    this.descriptionText = "";
    
  }

  reduceText() {
    if( this.props.escape && this.props.escape.scenario ) {
      var converter = new showdown.Converter();
      this.descriptionText = converter.makeHtml( this.props.escape.scenario );
      if( this.descriptionText ) {      
        const maxln = 300;
        this.descriptionText = this.descriptionText.replace(/(<([^>]+)>)/gi," ");
        let after = this.descriptionText.length > maxln ? "..." : "";
        this.descriptionText = this.descriptionText.substring(0,maxln) + after;
      }
    }

  }

  render() {

    if( !this.descriptionText ) this.reduceText();


    let imageUrl;
    if( this.props.escape.mini ) {
      if( this.props.escape.mini.formats && this.props.escape.mini.formats.small ) imageUrl = this.props.escape.mini.formats.small.url
      else  imageUrl = this.props.escape.mini.url;
    }

    let enseigneuip = this.props.enseigne ? this.props.enseigne.uniquepath : "avis";

    let pays = [];
    let regions = [];
    let town = [];
    if( this.props.escape.addresses && this.props.escape.addresses.length > 0 ) {
      this.props.escape.addresses.forEach(addr => {
        if( addr.pay && pays.indexOf(addr.pay.name) < 0 ) pays.push( addr.pay.name );
        if( addr.region && regions.indexOf(addr.region.name) < 0 ) regions.push( addr.region.name );
        if( addr.town && regions.indexOf(addr.town) < 0 && town.indexOf(addr.town) < 0 ) town.push( addr.town );
      });
    }

    let topinfo;
    if( pays.length > 0 ) {
      let addrTxt = pays.join(", ");
      if( regions.length > 0 ) addrTxt += " - " + regions.join(", ");
      if( town.length > 0 ) addrTxt += " - " + town.join(", ");
      topinfo = <span className="region" title={addrTxt}>{addrTxt}</span>
    } 
    
    return (

        <Card className="escape-card"
            preview={this.props.escape.name ? false : true}
            compact={this.props.compact ? true : false}
            reduce={this.props.reduce ? true : false}
            url={"/escapegame/"+enseigneuip+"/"+this.props.escape.uniquepath}
            title={<span title={this.props.escape.name}><span className="t">{this.props.escape.name}</span> <Note value={this.props.escape.rate} light={this.props.reduce ? true : false} compact/></span>}
            subTitle={this.props.enseigne ? this.props.enseigne.name : <span>&nbsp;</span>}
            supTitle={topinfo}
            imageUrl={imageUrl}
            imageTitle={this.descriptionText}
            more={<div className="description" ref={this.descp}><RichText>{ this.descriptionText }</RichText></div>}
        >
              {
                this.props.date &&
                <p className="date">{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.props.escape.date))}</p>
              }
              {
                this.props.escape.glandusor && 
                <div className="tags taggold">
                  <Tag>{this.props.escape.glandusor}</Tag>
                </div>
              }
              <div className="tags">
                
                {this.props.escape.nbPlayerMax === this.props.escape.nbPlayerMin && this.props.escape.nbPlayerMin === 1 && <Tag>{this.props.escape.nbPlayerMin} joueur</Tag>}
                {this.props.escape.nbPlayerMax === this.props.escape.nbPlayerMin && this.props.escape.nbPlayerMin >= 1 && <Tag>{this.props.escape.nbPlayerMin} joueurs</Tag>}
                {this.props.escape.nbPlayerMax !== this.props.escape.nbPlayerMin && <Tag>{this.props.escape.nbPlayerMin} à {this.props.escape.nbPlayerMax} joueurs</Tag >}
                {
                  this.props.escape.tags && this.props.escape.tags.filter(t => !t.isGold && t.isMention).sort((a,b) => { return !b.name ? 1 : a.name.localeCompare(b.name);} ).map(t => {
                    return <Tag key={t.id} className="mention">{t.name}</Tag>
                  })
                } 
                {
                  this.props.escape.tags && this.props.escape.tags.filter(t => !t.isGold && !t.isMention).sort((a,b) => { return !b.name ? 1 : a.name.localeCompare(b.name);} ).map(t => {
                    return <Tag key={t.id}>{t.name}</Tag>
                  })
                } 
              </div>
              {
                this.props.escape.name &&
                ( !this.props.escape.isOpen || (this.props.enseigne && !this.props.enseigne.isOpen) ) &&            
                 <div className="tags">
                  <Tag className="closed-tag">Fermée</Tag>
                </div>
              }
        </Card>

    )
  }

}


export default withRouter(EscapeCard);