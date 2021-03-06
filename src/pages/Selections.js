import React from "react";
import { withRouter } from "react-router-dom";
import HtmlHead from "../components/HtmlHead";
import SelectionsGrid from "../components/SelectionsGrid";
import Page500 from "./Page500";
import TopIllustration from "../components/meta/TopIllustration";
import Slice from "../components/meta/Slice";

  
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

        <Slice breath>
          <div className="all-selections">

            <h2>Les Glandus ont fait leurs choix !</h2>
            <p>Voici une liste de nos sélections régulièrement mises à jour. Elles devraient vous aider à rechercher votre prochaine salle !</p>
            <p>En laissant la souris au dessus d'une image vous aurez une brève description de la sélection.</p>
            <SelectionsGrid showAll={true} title={false} onError={()=>this.setState({error:true})}/>
          </div>
        </Slice>
          
      </div>
    )
  }

}


export default withRouter(Selections);