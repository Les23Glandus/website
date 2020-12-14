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
    let strapi = new strapiConnector();
    strapi.getRecentEscapes(3).then(
      list => {
        this.lastescapes = list;
        this.setState({loaded:true});
      }
    ).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
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
                        <EscapeCard reduce escape={n} enseigne={n.enseigne}/>
                      )
                    }
                        <Card className="seemore-card"
                            reduce={true}
                            url={"/escapegames"}
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