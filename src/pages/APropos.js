import { Skeleton, Image } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import "../css/apropos.scss";

  
class APropos extends React.Component {

  details = null;
  glandus = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
  }
  loadDetails() {
    let strapi = new strapiConnector();

    strapi.getAPropos().then( d => {
        this.details = d;
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

    if( !this.state.loaded ) {
      return (
        <div className="main-content-page">
          <Skeleton active/>
          <Skeleton active/>
          <Skeleton active avatar/>
        </div>
      )
    }

    let firstimage = null;
    if( this.details.illustrations && this.details.illustrations.length > 0 ) {
      firstimage = this.details.illustrations.shift();
    }

    return (
      <div>

        <div className="top-illustrations">
          {
            firstimage && <Image src={firstimage.url}/>
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
              this.glandus.map( n => <div className="gland" key={n.id}>
                  <h3>{n.name}</h3>
                  <div>{n.description}</div>
              </div>)
            }
          </div>
          
          <div className="illustrations">
            {
              this.details.illustrations && this.details.illustrations.map( n => <Image src={n.url}/>)
            }
          </div>
        </div>
      </div>
    )
  }

}


export default withRouter(APropos);