import React from "react";
import { withRouter } from "react-router-dom";
import HtmlHead from "../components/HtmlHead";
import SelectionsGrid from "../components/SelectionsGrid";
import Page500 from "./Page500";
import TopIllustration from "../components/meta/TopIllustration";

  
class Selections extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
    
    return (
      <div>
        
        <HtmlHead title={`Nos sélections`}/>

        
        <TopIllustration/>

        <div className="main-content-page">
          <div className="all-selections">

            <h2>Les Gandus ont fait leurs choix !</h2>
            <p>Voici une liste de nos sélections régulièrement mise à jour. Elles devraint vous aider à rechercher votre prochaine salle !</p>
            <p>En laissant la souris au dessus d'une image vous aurez une brève description de la sélection.</p>
            <SelectionsGrid showAll={true} title={false}/>
          </div>
        </div>

          
      </div>
    )
  }

}


export default withRouter(Selections);