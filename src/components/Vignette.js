import React from "react";
import { withRouter, Link } from "react-router-dom";
import Note from "./Note";
import '../css/vignette.scss';
  
class Vignette extends React.Component {

  render() {
    
    return (
        <div className="vignette">
          <Link to="/article">
            <p>Name</p>
            <p>Enseigne</p>
            <p><Note/></p>
            <p>10/12/2020</p>
          </Link>
        </div>
    )
  }

}


export default withRouter(Vignette);