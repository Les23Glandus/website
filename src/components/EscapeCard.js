import React from "react";
import { Link, withRouter } from "react-router-dom";
import Note from "./Note";
import "../css/escapecard.scss";
import { Tag } from "antd";
  
class EscapeCard extends React.Component {

  render() {
    
    return (
        <div className="escape-card">
            <Link to={"/escapegame/"+this.props.enseigne.uniquepath+"/"+this.props.escape.uniquepath}>
                {
                  this.props.enseigne.addresses.length > 0
                  && 
                  <span>{this.props.enseigne.addresses[0].pay.name}</span>
                }
                <span>{this.props.escape.name}</span>
                <span>{this.props.enseigne.name}</span>
                
                <span>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.props.escape.date))}</span>
                <span><Note value={this.props.escape.rate}/></span>
                {this.props.reduce &&
                  <span>{this.props.escape.nbPlayerMin}-{this.props.escape.nbPlayerMax} joueurs</span>
                }
                {this.props.reduce &&
                  <span>Tags {this.props.escape.tags && this.props.escape.tags.map(n => <Tag>2 joueurs</Tag> )} </span>
                }
            </Link>
        </div>
    )
  }

}


export default withRouter(EscapeCard);