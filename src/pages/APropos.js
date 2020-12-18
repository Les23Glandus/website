import { Skeleton, Image } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import TopIllustration from "../components/meta/TopIllustration";
import "../css/apropos.scss";
import Page500 from "./Page500";

  
class APropos extends React.Component {

  details = null;
  glandus = null;
  firstimage;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
  }
  loadDetails() {
    let strapi = new strapiConnector();

    strapi.getAPropos().then( d => {
        this.details = d;
        
        this.firstimage = null;
        if( this.details.illustrations && this.details.illustrations.length > 0 ) {
          this.firstimage = this.details.illustrations.shift();
        }
        if(this.details !== null && this.glandus !== null) {
          this.setState({loaded:true});
        }
    }).catch( e => {
      this.setState({error:true});
    });
    
    strapi.getGlanduses().then( d => {
      this.glandus = d;
      if(this.details !== null && this.glandus !== null) {
        this.setState({loaded:true});
      }
  }).catch( e => {
    this.setState({error:true});
  });
  }

  componentDidMount() {
    this.loadDetails();
  }

  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }

    if( !this.state.loaded ) {
      return (
        <div>

          <TopIllustration/>
          <div className="main-content-page">
            <Skeleton active/>
            <Skeleton active/>
            <Skeleton active avatar/>
            <Skeleton active avatar/>
            <Skeleton active avatar/>
          </div>
        </div>
      )
    }


    return (
      <div>

        <div className="top-illustrations">
          {
            this.firstimage && <Image src={this.firstimage.url}/>
          }
        </div>

        <div className="a-propos main-content-page">
          <div className="article">
            <h2>{this.details.title}</h2>
            <div>
              { this.details.article }
            </div>
          </div>

          <div className="groupe">
            {
              this.glandus.map( n => <div className="gland" key={"g"+n.id}>
                  <h3>{n.name}</h3>
                  <div>{n.description}</div>
              </div>)
            }
          </div>
          
          <div className="illustrations">
            {
              this.details.illustrations && this.details.illustrations.map( n => <Image key={"img"+n.id} src={n.url}/>)
            }
          </div>
        </div>
      </div>
    )
  }

}


export default withRouter(APropos);