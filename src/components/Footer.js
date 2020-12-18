import React from "react";
import { Link, withRouter } from "react-router-dom";
import ShareLinks from "./meta/ShareLinks";
  
class Footer extends React.Component {

  render() {
    
    return (
        <div className="main-footer">
          <div className="">
            <img src={process.env.PUBLIC_URL + "/Glandus-192px.png"} alt="Logo Les Glandus"/>
          </div>
          <div className="">
            <ul className="sitemap">
              <li className="home"><Link to="/">Accueil</Link></li>
              <li><Link to="/escapegame/">Immersive Game</Link></li>
              <li><Link to="/selections/">Nos sélections</Link></li>
              <li><Link to="/jeux/">Jeux de société</Link></li>
              <li><Link to="/news">Actualités</Link></li>
              <li><Link to="/about">A propos</Link></li>
              <li><Link to="/search">Recherchez</Link></li>
            </ul>
          </div>
          <ShareLinks/>
        </div>
    )
  }

}


export default withRouter(Footer);