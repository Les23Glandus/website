import React from "react";
import { Link, withRouter } from "react-router-dom";
import HtmlHead from "../components/HtmlHead";
import TopIllustration from "../components/meta/TopIllustration";
import Page500 from "./Page500";
import "../css/search.scss";
import Search from "antd/lib/input/Search";
import { Image, Skeleton } from "antd";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "../components/EscapeCard";
import JeuxCard from "../components/JeuxCard";
import SelectionCard from "../components/SelectionCard";
import ActusCard from "../components/ActusCard";

  
class SearchP extends React.Component {

  static minLength = 4;

  constructor(props) {
    super(props);
    this.state = {error:false, query:"", qtoshort:false,
            escapeList:[],
            actuList:[],
            enseigneList:[],
            jeuxList:[],
            selectionList:[],
    };
  }

  doSearch( query ) {
    let reg = /^\s*$/;
    if( !reg.test(query) ) {
      query = query.trim();
      if( query.length < SearchP.minLength ) {
        this.setState({qtoshort:true});
      } else {
        this.setState({qtoshort:false, searching:true, query:query});

        let strapi = new strapiConnector();

        query = query.replace(/\s+/, " ").split(" ");

        let started = [["actu",true],["jeux",true],["escape",true],["enseigne",true],["selection",true]];

        strapi.searchActus( query , 10 ).then( d => {
          if(!d) d=[];
          started.find( n => n[0] === "actu" )[1] = false;
          let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
          this.setState({ actuList:d , searching:stillSearching });
        });
        strapi.searchEscapes( query , 10 ).then( d => {
          if(!d) d=[];
          started.find( n => n[0] === "escape" )[1] = false;
          let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
          this.setState({ escapeList:d , searching:stillSearching });
        });
        strapi.searchJeux( query , 10 ).then( d => {
          if(!d) d=[];
          started.find( n => n[0] === "jeux" )[1] = false;
          let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
          this.setState({ jeuxList:d , searching:stillSearching });
        });
        strapi.searchEnseigne( query , 10 ).then( d => {
          if(!d) d=[];
          started.find( n => n[0] === "enseigne" )[1] = false;
          let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
          this.setState({ enseigneList:d , searching:stillSearching });
        });
        strapi.searchSelection( query , 10 ).then( d => {
          if(!d) d=[];
          started.find( n => n[0] === "selection" )[1] = false;
          let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
          this.setState({ selectionList:d , searching:stillSearching });
        });

      }

  
      //this.setState({query:query});
    }
    
  }

  onChange( e ) {
    if( e.target.value ) {
      let query = e.target.value.trim();
      if( query.length < SearchP.minLength ) {
      } else {
        this.setState({qtoshort:false});
      }
    }

  }
  
  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
    
    return (
      <div>
        <HtmlHead title={`Résultat de recherche pour ${this.state.query}`}/>


        <TopIllustration/>
        <div className="search-main">

          <div className="search-field">
            <p>Recherchez sur le site :</p>
            <Search onSearch={this.doSearch.bind(this)} onChange={this.onChange.bind(this)}/>
            {
              this.state.qtoshort &&
              <p className="error">
                Le texte recherché est trop court.
              </p>
            }
          </div>

          <div className="search-result">
            <h3>Résultats de recherche pour "{this.state.query}"</h3>
            <div className="results">
              
              <div>
                <h3>Les expériences immersives</h3>
                <div>
                  {
                    this.state.searching && this.state.escapeList.length === 0 &&
                    <Skeleton avatar active/>
                  }
                  {
                    this.state.escapeList.map( n => <EscapeCard escape={n} enseigne={n.enseigne} reduce compact/> )
                  }
                  {
                    !this.state.searching && this.state.escapeList.length === 0 &&
                    <div className="no-result">Aucun résultat trouvé.</div>
                  }
                </div>
              </div>
              
              <div>
                <h3>Nos sélections</h3>
                <div>
                  {
                    this.state.searching && this.state.selectionList.length === 0 &&
                    <Skeleton avatar active/>
                  }
                  {
                    this.state.selectionList.map( n => <SelectionCard details={n} reduce compact/> )
                  }
                  {
                    !this.state.searching && this.state.selectionList.length === 0 &&
                    <div className="no-result">Aucun résultat trouvé.</div>
                  }
                </div>
              </div>

              <div>
                <h3>Les enseignes</h3>
                <div>
                  {
                    this.state.searching && this.state.enseigneList.length === 0 &&
                    <Skeleton avatar active/>
                  }
                  {
                    this.state.enseigneList.map( n => {
                      let img = process.env.PUBLIC_URL + "/patterns/Pattern04.svg";
                      if( n.logo ) {
                        img = n.logo.formats.thumbnail.url;
                      }
                      return <Link to={"/escapegame/"+n.uniquepath}><Image src={img} alt={n.name} title={n.name} width={150}/></Link>} )
                  }
                  {
                    !this.state.searching && this.state.enseigneList.length === 0 &&
                    <div className="no-result">Aucun résultat trouvé.</div>
                  }
                </div>
              </div>

              <div>
                <h3>Les jeux</h3>
                <div>
                  {
                    this.state.searching && this.state.jeuxList.length === 0 &&
                    <Skeleton avatar active/>
                  }
                  {
                    this.state.jeuxList.map( n => <JeuxCard jeux={n} reduce compact/> )
                  }
                  {
                    !this.state.searching && this.state.jeuxList.length === 0 &&
                    <div className="no-result">Aucun résultat trouvé.</div>
                  }
                </div>
              </div>
              
              <div>
                <h3>Les actus</h3>
                <div>
                  {
                    this.state.searching && this.state.actuList.length === 0 &&
                    <Skeleton avatar active/>
                  }
                  {
                    this.state.actuList.map( n => <ActusCard details={n} reduce compact/> )
                  }
                  {
                    !this.state.searching && this.state.actuList.length === 0 &&
                    <div className="no-result">Aucun résultat trouvé.</div>
                  }
                </div>
              </div>

            </div>
          </div>


        </div>

      </div>
    )
  }

}


export default withRouter(SearchP);