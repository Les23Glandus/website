import React from "react";
import { withRouter } from "react-router-dom";
import "../css/escapecard.scss";
import { Tag } from "antd";
import Card from "./meta/Card";
  
class EscapeCard extends React.Component {

  render() {

    let imageUrl;
    if( this.props.escape.mini ) {
      if( this.props.escape.mini.formats.small ) imageUrl = this.props.escape.mini.formats.small.url
      else  imageUrl = this.props.escape.mini.url;
    }

    let enseigneuip = this.props.enseigne ? this.props.enseigne.uniquepath : "avis";

    let pays = [];
    let regions = [];
    if( this.props.escape.addresses && this.props.escape.addresses.length > 0 ) {
      this.props.escape.addresses.forEach(addr => {
        if( addr.region && regions.indexOf(addr.region.name) < 0 ) regions.push( addr.region.name );
        if( addr.pay && regions.indexOf(addr.pay.name) < 0 ) pays.push( addr.pay.name );
      });
    }

    let topinfo;
    if( pays.length > 0 ) {
      topinfo = <span className="region">{pays.length > 0 && pays.join(", ")}{regions.length > 0 && (' - '+regions.join(", "))}</span>
    } 
    
    
    return (

        <Card className="escape-card"
            reduce={this.props.reduce ? true : false}
            url={"/escapegame/"+enseigneuip+"/"+this.props.escape.uniquepath}
            title={this.props.escape.name}
            subTitle={this.props.enseigne.name}
            supTitle={topinfo}
            imageUrl={imageUrl}
            imageTitle={this.props.escape.description}
            more={<div className="description">{ this.props.escape.description }</div>}
        
        >
              {
                this.props.date &&
                <p className="date">{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.props.escape.date))}</p>
              }
              <div className="tags">
                {
                  this.props.escape.tags && this.props.escape.tags.filter(t => !t.isGold).map(t => {
                    return <Tag key={t.id}>{t.name}</Tag>
                  })
                } 
              </div>
              <span>{this.props.escape.nbPlayerMin}-{this.props.escape.nbPlayerMax} joueurs</span>
        </Card>

    )
  }

}


export default withRouter(EscapeCard);