import React from "react";
import { withRouter } from "react-router-dom";
import Note from "./Note";
import "../css/escapecard.scss";
import { Tag } from "antd";
  
class EscapeCard extends React.Component {

  render() {
    
    return (
        <div className="escape-card">
            <a href={"/escapegame/"+this.props.enseigne.uniquepath+"/"+this.props.escape.uniquepath}>
                {
                  this.props.enseigne.address.length > 0
                  && 
                  <span>{this.props.enseigne.address[0].pays.name}</span>
                }
                <span>{this.props.escape.name}</span>
                <span>{this.props.enseigne.name}</span>
                <span><Note value={this.props.escape.rate}/></span>
                {this.props.reduce &&
                <span>{this.props.escape.nbPlayerMin}-{this.props.escape.nbPlayerMax} joueurs</span>
                }
                {this.props.reduce &&
                <span>Tags {this.props.escape.tags && this.props.escape.tags.map(n => <Tag>2 joueurs</Tag> )} </span>
                }
            </a>
        </div>
    )
  }

}


export default withRouter(EscapeCard);