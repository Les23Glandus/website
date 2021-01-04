import React from "react";
import { withRouter } from "react-router-dom";
import Page500 from "./Page500";
import TopIllustration from "../components/meta/TopIllustration";
import JeuxGrid from "../components/JeuxGrid";
import Slice from "../components/meta/Slice";

  
class Jeux extends React.Component {

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
           
        <TopIllustration/>

        <Slice className="all-selections" breath>
            <h2>Les Gandus sont joueurs !</h2>
            <p>Entre deux missions, on s’entraîne et puis on aime bien jeter des dés, mélanger des cartes, fomenter les pires trahisons etc… etc…</p>
            <JeuxGrid showAll={true} title={false} onError={()=>this.setState({error:true})}/>
        </Slice>

          

          
      </div>
    )
  }

}


export default withRouter(Jeux);