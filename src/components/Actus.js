import { Skeleton } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import HtmlHead from "./HtmlHead";
import TopIllustration from "./meta/TopIllustration";

  
class Actus extends React.Component {

  details = null;
  loading = false;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};

    if( props.details ) {
      this.details = props.details;
      this.state.loaded = true;
    }
  }

  loadDetails() {
      this.loading = true;
  
      new strapiConnector().getActuByRef(this.props.actuRef).then( d => {
          this.details = d;
          this.loading = false;
          this.setState({loaded:true, uref:this.details.uniquepath});
      }).catch( e => {
        this.loading = false;
        this.setState({error:true});
      });
  }



  componentDidMount() {
    if(!this.state.loaded && !this.state.error && this.props.actuRef) this.loadDetails();
  }

  render() {

    if(!this.state.loaded) {
      return (<div>
                <HtmlHead title="News"/>
                <Skeleton active avatar/>
              </div>)
    }

    if( this.props.reduce ) {
        return (
          <div>
              <Link to={"/news/"+this.details.uniquepath}>
                <h3>{this.details.title}</h3>
                <p>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.details.date))}</p>
                <p>{this.details.description}</p>
                <p>{this.details.channel}</p>
              </Link>
          </div>
        )
    } 

    return (
        <div>
            <HtmlHead title={`News - ${this.details.title}`}/>
              <h2>{this.details.title}</h2>
              <p>{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.details.date))}</p>
              <p>{this.details.description}</p>
              <div>{this.details.article}</div>
        </div>
    )
  }

}


export default withRouter(Actus);