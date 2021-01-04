import { Skeleton, Image } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import Slice from "./meta/Slice";

class Group extends React.Component {

  details = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};

    if( props.details ) {
      this.details = props.details;
      this.state.loaded = true;
    }
  }

  loadDetails() {
    new strapiConnector().getHomeAPropos().then( d => {
        this.details = d;
        this.setState({loaded:true});
      }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
  }

  componentDidMount() {
    this.loadDetails();
  }

  render() {

    if( !this.state.loaded ) {
        return (
          <div className="main-group">
            <div>
              <Skeleton active></Skeleton>
            </div>
            <div>
              <Skeleton avatar active></Skeleton>
            </div>
          </div>
      )
    }

    return (
        <Slice className="main-group" colored>
            <div>
              {
                this.details.illustrations && this.details.illustrations.length > 0 &&
                <Image src={ this.details.illustrations[0].formats.small.url }/>
              }
            </div>
            
            <div>
              <h3>{ this.details.title }</h3>
              <div>
                { this.details.article }
                <p><Link to="/about">En savoir plus</Link></p>
              </div>
            </div>
        </Slice>
    )
  }

}


export default withRouter(Group);