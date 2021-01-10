import React from "react";
import { withRouter } from "react-router-dom";
import {  Skeleton  } from "antd";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "./EscapeCard";
import Card from "./meta/Card";
  
class EscapeLatestsTests extends React.Component {

  lastescapes;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false, realisation:null};
  }

  loadEscapes( extendSearch ) {
    const nbElement = this.props.nbCards ? this.props.nbCards : 3;
    let strapi = new strapiConnector();

    if( this.props.tagslist ) {
      let sortOptions = ["date:ASC","name:ASC","rate:ASC","date:DESC","name:DESC","rate:DESC"];
      let query = {isOpen:true, preventPush:false};
      query.isOpen = true;
      query["enseigne.isOpen"] = true;

      if( !extendSearch && this.props.tagslist.length > 0 ) {
        query.tags = this.props.tagslist;
      }
      if( this.props.notID ) {
        query["id_ne"] = this.props.notID;
      }
      if( this.props.notEnseingeID ) {
        query["enseigne.id_ne"] = this.props.notEnseingeID;
      }
      if( this.props.regroupement && this.props.regroupement.length > 0 ) {
        query["addresses.regroupement.id"] = this.props.regroupement;
      }
      if( this.props.region && this.props.region.length > 0 ) {
        query["addresses.region.id"] = this.props.region;
      }

      let updateEscapeContent = (strapi, subList) => {
        if( subList.length === 0 ) {
          this.lastescapes = [];
          this.setState({loaded:true});
        } else {
          strapi.getEscapeByRef(subList).then(
            list => {
              this.lastescapes = list;
              this.setState({loaded:true});
            }
          ).catch(e => {} );
        }
      }

      strapi.browseEscapes(query, 30, sortOptions[ ~~(Math.random() * sortOptions.length) ], true).then(
        list => {
          let subList ;
          if( list.length > nbElement ) {
            subList = [];
            for( let i = 0; i < nbElement; i++ ) {
              let index = ~~(Math.random() * list.length);
              subList.push( list.splice(index,1)[0].uniquepath );
            }

            updateEscapeContent(strapi, subList );
          } else {
            subList = list.map( n => n.uniquepath );
            delete( query.tags );
            strapi.browseEscapes(query, 10, sortOptions[ ~~(Math.random() * sortOptions.length) ], true).then(
              nlist => {
                nlist = nlist.filter( n => subList.indexOf( n.uniquepath ) < 0 );
                for( let i = subList.length; i < nbElement && nlist.length > 0; i++ ) {
                  let index = ~~(Math.random() * nlist.length);
                  let up = nlist.splice(index,1)[0].uniquepath;
                  if( subList.indexOf(up) < 0 ) subList.push( up );
                }
                updateEscapeContent(strapi, subList );
              }
            );
          }
        }
      ).catch(e => {});

    } else {
      strapi.getRecentEscapes(nbElement).then(
        list => {
          this.lastescapes = list;
          this.setState({loaded:true});
        }
      ).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
    }
  }

  componentDidMount() {
    this.loadEscapes();
  }


  render() {
    
    return (
        
        <div className="latest-ei-tests">
            <h3>{this.props.title ? this.props.title : "Les nouveaux tests"}</h3>
            <div>
                {this.lastescapes && 
                  <div className="flexgrid grid-escape">
                    {
                      this.lastescapes.map( n => 
                        <EscapeCard key={'ec'+n.id} reduce escape={n} enseigne={n.enseigne}/>
                      )
                    }
                        <Card className="seemore-card"
                            reduce={true}
                            url={"/escapegame"}
                            bigText={"Toutes les expériences immersives"}
                            subTitle={<span>&nbsp;</span>}
                            title={<span>&nbsp;</span>}
                            supTitle={""}
                            imageUrl={null}
                            imageTitle={""}
                            more={""}
                            color={null}
                        
                        ></Card>
                  </div>
                }
                {!this.lastescapes && <Skeleton active title={false} paragraph={true}/>}
            </div>
        </div>
    )
  }

}


export default withRouter(EscapeLatestsTests);