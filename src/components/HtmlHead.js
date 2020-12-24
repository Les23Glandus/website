import React from "react";
import { withRouter } from "react-router-dom";
import {Helmet} from "react-helmet";
import CONFIG from "../class/config";

  
class HtmlHead extends React.Component {

  defaultDescription = "Le Glandu est une espèce nommée depuis 2016 qui appartient à la famille des Homo-escapus. D'un naturel joueur, le Glandu de base est le plus facilement observable aux abords des points d'activités ludiques... en cherchant bien autour d'une table de jeu ou à la sortie d'une escape, vous pourrez aisément en croiser un.";

  title = "Les Glandus";

  render() {

    let title = (this.props.title ? this.props.title + " - " : "") + this.title;

    return (
        <Helmet>
            <title>{title} - Blog et Avis Escape Game</title>
            <meta name="description" content={this.props.description ? this.props.description : this.defaultDescription }/>
            <meta name="twitter:description" content={this.props.description ? this.props.description : this.defaultDescription }></meta>
            <meta name="subject" content="Avis et évaluation des salles d'Escape Game."></meta>
            <meta name="coverage" content="Worldwide"></meta>
            <meta name="Classification" content="Business"/>
            <meta property="og:url" content={CONFIG.origin + window.location.pathname }/>
            <meta property="fb:app_id" content="658512374819098"/>
            <meta property="og:locale" content="fr_FR"/>
            <meta property="og:site_name" content="LesGlandus.fr"/>
            <meta property="og:type" content="article"/>
            <meta property="og:article:author" content="Les Glandus"/>
            <meta property="og:article:section" content="Escape Games"/>
            <meta property="og:description" content={this.props.description ? this.props.description : this.defaultDescription }/> 
            <meta property="og:title" content={title}/>  
            <meta name="twitter:title" content={title}/>
            <meta name="twitter:card" content="summary_large_image"></meta>
            

            { this.props.children }        
        </Helmet>
    )
  }

}


export default withRouter(HtmlHead);