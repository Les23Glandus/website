import React from "react";
import { Link, withRouter } from "react-router-dom";
import Note from "./Note";
import "../css/escapecard.scss";
  
class EscapeCard extends React.Component {

  render() {
    
    return (
        <div className="escape-card">
            <Link to="/article">
                <span>Pays</span>
                <span>Nom salle</span>
                <span>Nom enseigne</span>
                <span><Note/></span>
                <span>Tags : 2 joueurs, test</span>
            </Link>
        </div>
    )
  }

}


export default withRouter(EscapeCard);