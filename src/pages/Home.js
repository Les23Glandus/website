import React from "react";
import { withRouter } from "react-router-dom";
import ActusGrid from "../components/ActusGrid";
import Carousel from "../components/Carousel";
import EscapeBilan from "../components/EscapeBilan";
import EscapeLatestsTests from "../components/EscapeLatestsTests";
import Group from "../components/Group";
import JeuxGrid from "../components/JeuxGrid";
import SelectionsGrid from "../components/SelectionsGrid";
import "../css/home.scss";
import Page500 from "./Page500";

  
class Home extends React.Component {

  constructor(props) {
    super(props);
    this.state = {error:false};
  }
  

  render() {

    if( this.state.error ) {
      return ( <Page500/> )
    }
    
    return (
      <div className="home">
          <Carousel/>

          <div className="main-content-page">
            <h2 className="main-subtitle">Expériences Immersives</h2>
            <EscapeBilan/>
            <EscapeLatestsTests onError={()=>this.setState({error:true})}/>
            <SelectionsGrid onError={()=>this.setState({error:true})}/>
          </div>
            

          <div className="zoning section-jeux">
            <div className="main-content-page">
                <h2>Jeux de société</h2>
                <JeuxGrid/>
            </div>
          </div>

          <div className="main-content-page">
            <h2>Notre actualité</h2>
            <ActusGrid onError={()=>this.setState({error:true})}/>
          </div>
          
          <Group/>
      </div>
    )
  }

}


export default withRouter(Home);