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

  static minLength = 3;
  static stopWords = ['the','le','la',"les","ces","du","de","l","des","c",",","-","_",".",";","?","escape"];
  static limit = 30;

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

  doSearch( input ) {
    let {query,rawquery} = this.preprocessQuery(input);

    if( query.length === 0 ) {
      this.setState({qtoshort:true});
    } else {
      this.setState({qtoshort:false, searching:true, query:input,
                  escapeList:[],
                  actuList:[],
                  enseigneList:[],
                  jeuxList:[],
                  selectionList:[],
          });

      let strapi = new strapiConnector();
      let started = [["actu",true],["jeux",true],["escape",true],["enseigne",true],["selection",true]];

      const limit = SearchP.limit;
      strapi.searchEscapes( query , limit ).then( d => {
        if(!d) d=[];
        else d = this.reduceList( d, rawquery, "name");
        started.find( n => n[0] === "escape" )[1] = false;
        let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
        this.setState({ escapeList:d , searching:stillSearching });
      });
      strapi.searchJeux( query , limit ).then( d => {
        if(!d) d=[];
        else d = this.reduceList( d, rawquery, "name");
        started.find( n => n[0] === "jeux" )[1] = false;
        let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
        this.setState({ jeuxList:d , searching:stillSearching });
      });
      strapi.searchEnseigne( query , limit ).then( d => {
        if(!d) d=[];
        else d = this.reduceList( d, rawquery, "name");
        started.find( n => n[0] === "enseigne" )[1] = false;
        let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
        this.setState({ enseigneList:d , searching:stillSearching });
      });
      strapi.searchSelection( query , limit ).then( d => {
        if(!d) d=[];
        else d = this.reduceList( d, rawquery, "title");
        started.find( n => n[0] === "selection" )[1] = false;
        let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
        this.setState({ selectionList:d , searching:stillSearching });
      });
      strapi.searchActus( query , limit ).then( d => {
        if(!d) d=[];
        else d = this.reduceList( d, rawquery, "title");
        started.find( n => n[0] === "actu" )[1] = false;
        let stillSearching = ( started.filter( n => n[1] ).length === 0 ) ? false : true;
        this.setState({ actuList:d , searching:stillSearching });
      });

    }


    
  }

  preprocessQuery( rawquery ) {
    let reg = /^\s*$/;
    rawquery = rawquery.trim().replace(/\s+/, " ").split(/([cl]'|[,-_.;]|\s)/).filter(n => !reg.test(n));
    let query = rawquery.filter( n => n.length >= SearchP.minLength && SearchP.stopWords.indexOf(n) < 0 );

    return {query:query, rawquery:rawquery};
  }

  onChange( e ) {
    if( e.target.value ) {
      let {query,rawquery} = this.preprocessQuery( e.target.value );
      if( query.length !== 0 ) {
        this.setState({qtoshort:false});
      } 
    }

  }

  reduceList( list, query , field ) {
    let max_appear = 0;

    list = list.map( n => {
        let count = 0;
        query.forEach(element => {
          if( n[field] && n[field].toLowerCase().indexOf( element.toLowerCase() ) >= 0 ) count++;
        });
        n["__found"] = count;
        max_appear = Math.max(max_appear,count);
        return n;
    })

    return list.filter( n => n["__found"] === max_appear).map(n => { delete(n["_found"]); return n;} );
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
            {
              this.state.query && 
              <h3>Résultats de recherche pour "{this.state.query}"</h3>
            }
            <div className="results">
              
              
              {
                (this.state.searching || this.state.escapeList.length > 0)
                &&
                <div className="escapes">
                  <h3>Les expériences immersives</h3>
                  <div className="sublist">
                    {
                      this.state.searching && this.state.escapeList.length === 0 &&
                      <Skeleton avatar active/>
                    }
                    {
                      this.state.escapeList.map( n => <EscapeCard key={'e'+n.id} escape={n} enseigne={n.enseigne} reduce compact/> )
                    }
                    {
                      !this.state.searching && this.state.escapeList.length === 0 &&
                      <div className="no-result">Aucun résultat trouvé.</div>
                    }
                  </div>
                </div>
              }
              
              
              {
                (this.state.searching || this.state.selectionList.length > 0)
                &&
                <div>
                  <h3>Nos sélections</h3>
                  <div className="sublist">
                    {
                      this.state.searching && this.state.selectionList.length === 0 &&
                      <Skeleton avatar active/>
                    }
                    {
                      this.state.selectionList.map( n => <SelectionCard key={'s'+n.id} details={n} reduce compact/> )
                    }
                    {
                      !this.state.searching && this.state.selectionList.length === 0 &&
                      <div className="no-result">Aucun résultat trouvé.</div>
                    }
                  </div>
                </div>
              }

              {
                (this.state.searching || this.state.enseigneList.length > 0)
                &&
                <div>
                  <h3>Les enseignes</h3>
                  <div className="sublist">
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
                        return <div key={'c'+n.id}><Link to={"/escapegame/"+n.uniquepath}><Image src={img} alt={n.name} title={n.name} width={150}/></Link></div>} )
                    }
                    {
                      !this.state.searching && this.state.enseigneList.length === 0 &&
                      <div className="no-result">Aucun résultat trouvé.</div>
                    }
                  </div>
                </div>
              }


              {
                (this.state.searching || this.state.jeuxList.length > 0)
                &&
                <div>
                  <h3>Les jeux</h3>
                  <div className="sublist">
                    {
                      this.state.searching && this.state.jeuxList.length === 0 &&
                      <Skeleton avatar active/>
                    }
                    {
                      this.state.jeuxList.map( n => <JeuxCard key={'j'+n.id} jeux={n} reduce compact/> )
                    }
                    {
                      !this.state.searching && this.state.jeuxList.length === 0 &&
                      <div className="no-result">Aucun résultat trouvé.</div>
                    }
                  </div>
                </div>
              }
              
              
              {
                (this.state.searching || this.state.actuList.length > 0)
                &&
                <div>
                  <h3>Les actus</h3>
                  <div className="sublist">
                    {
                      this.state.searching && this.state.actuList.length === 0 &&
                      <Skeleton avatar active/>
                    }
                    {
                      this.state.actuList.map( n => <ActusCard key={'a'+n.id} details={n} reduce compact/> )
                    }
                    {
                      !this.state.searching && this.state.actuList.length === 0 &&
                      <div className="no-result">Aucun résultat trouvé.</div>
                    }
                  </div>
                </div>
              }

            </div>
          </div>


        </div>

      </div>
    )
  }

}


export default withRouter(SearchP);