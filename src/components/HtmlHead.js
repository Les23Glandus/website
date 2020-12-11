import React from "react";
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";

  
class HtmlHead extends React.Component {

  render() {

    return (
        <Helmet>
            <title>{this.props.title ? this.props.title + " - " : ""}Les Glandus - Blog et Avis Escape Game</title>
            <meta name="description" content={this.props.description ? this.props.description : "" }/>
            <meta name="subject" content="Avis et évaluation des salles d'Escape Game."></meta>
            <meta name="coverage" content="Worldwide"></meta>
            <meta name="Classification" content="Business"/>
            <meta property="og:url" content={window.location.href}/>
            <meta property="og:locale" content="fr_FR"/>
            <meta property="og:site_name" content="LesGlandus.fr"/>
            <meta property="og:type" content="article"/>
            <meta property="og:article:author" content="Les Glandus"/>
            <meta property="og:article:section" content="Escape Games"/>
            { this.props.title && <meta property="og:title" content={this.props.title}/> }  

            { this.props.children }        
        </Helmet>
    )
  }

}


export default withRouter(HtmlHead);