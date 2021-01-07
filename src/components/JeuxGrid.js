import React from "react";
import { withRouter } from "react-router-dom";
import { Skeleton  } from "antd";
import strapiConnector from "../class/strapiConnector";
import Card from "./meta/Card";
import JeuxCard from "./JeuxCard";
import HtmlHead from "./HtmlHead";
import CONFIG from "../class/config";
  
class JeuxGrid extends React.Component {

  details;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    if( this.props.showAll ) {
      new strapiConnector().getJeux().then(d => { 
        this.details = d;
        this.setState({loaded:true, error:false});
      }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
    } else {
      new strapiConnector().getRecentJeux(3).then(d => { 
        this.details = d;
        this.setState({loaded:true, error:false});
      }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
    }

  }

  
  render() {
    let jsonld;
    if( this.state.loaded && this.props.showAll ) {
      jsonld = 
      {
        "@context":"https://schema.org",
        "@type":"ItemList",
        "itemListElement":[]
      }
      this.details.forEach( (n,i) =>  {
        let url = CONFIG.origin + "/jeux/"+n.uniquepath;
        let pic = CONFIG.origin + (n.mini ? n.mini.url : "");
        jsonld.itemListElement.push(  
          {
            "@type":"ListItem",
            "position":(i+1),
            "url":url,
            "name":n.name, 
            "image":pic        
          }
        );
      });
    }

    let years = [];
    for( let y = (new Date()).getFullYear(); y >= 2017; y-- ) {
      years.push( y );           
    }
    
    return (
        
        <div className="selections-list">
            {
              this.props.showAll && 
              <HtmlHead title={`Nos articles Jeux de société`}>
                  <meta property="og:description" content="Liste des articles sur les jeux de société et livres d'escapes."/>
                  <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
              </HtmlHead>
            }

            <div>
                {this.state.loaded === false && <Skeleton active/>}
                

                  {
                    this.state.loaded && !this.props.showAll && 
                    <div>
                      <h3>Nos articles</h3>
                      <div className="flexgrid grid-actus">
                        { this.details.map( n => <JeuxCard key={'jc'+n.id} jeux={n} reduce/>) }
                        <Card className="seemore-card"
                              reduce={true}
                              url={"/jeux"}
                              bigText={"Tous nos articles"}
                              subTitle={<span>&nbsp;</span>}
                              title={<span>&nbsp;</span>}
                              supTitle={""}
                              imageUrl={null}
                              imageTitle={""}
                              more={""}
                              color={null}
                          
                          ></Card>
                      </div>
                    </div>
                  }
                  
                  {
                    this.state.loaded && this.props.showAll && 
                    <div className="flexgrid grid-actus">
                      {
                        years.map( y => {
                          let list = this.details.filter( n => { if(!n["date"]) n["date"] = "2021"; return n["date"].indexOf(y) >= 0;});
                          if( list.length > 0 ) {
                            return <div>
                              <h3>{y}</h3>
                              <div className="flexgrid grid-actus">
                                { list.map( n => <JeuxCard key={'jc'+n.id} jeux={n} reduce/>) }
                              </div>
                            </div>
                          } else return "";
                        } )
                      }
                    </div>
                  }
                  <div className="flexgrid grid-actus">
                  </div>
            </div>
        </div>
    )
  }

}


export default withRouter(JeuxGrid);