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

            { this.props.article && <meta name="og:title" content={this.props.article.name}/> }
            { this.props.article && <meta name="og:type" content="Escape Game"/> }
            { this.props.article && <meta name="og:site_name" content="LesGlandus.fr"/> }
            { /*this.props.article && <meta name="og:url" content="http://www.imdb.com/title/tt0117500/"/> }
            { this.props.article && <meta name="og:image" content="http://ia.media-imdb.com/rock.jpg"/> }
            { this.props.article && <meta name="og:description" content="A group of U.S. Marines, under command of..."/> */}
            
        </Helmet>
    )
  }

}


export default withRouter(HtmlHead);