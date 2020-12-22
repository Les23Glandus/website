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

  loadEscapes() {
    const nbElement = 3;
    let strapi = new strapiConnector();

    if( this.props.tagslist ) {
      let sortOptions = ["date:ASC","name:ASC","rate:ASC","date:DESC","name:DESC","rate:DESC"]
      let query = {isOpen:true, preventPush:false};
      query.isOpen = true

      if( this.props.tagslist.length > 0 ) {
        query.tags = this.props.tagslist;
      }
      if( this.props.notID ) {
        query["id_ne"] = this.props.notID;
      }
      if( this.props.pay ) {
        //query["address.pay"] = this.props.pay;
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
          } else {
            subList = list.map( n => n.uniquepath );
          }

          strapi.getEscapeByRef(subList).then(
            list => {
              this.lastescapes = list;
              this.setState({loaded:true});
            }
          ).catch(e => {} );

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
                            subTitle={""}
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