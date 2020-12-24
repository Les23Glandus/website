import { Image, Skeleton } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import CONFIG from "../class/config";
import HtmlHead from "./HtmlHead";
import RichText from "./meta/RichText";

  
class Actus extends React.Component {

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
  
      new strapiConnector().getActuByRef(this.props.actuRef).then( d => {
          this.details = d;
          this.setState({loaded:true, uref:this.details.uniquepath});

      }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
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
                <p><RichText>{this.details.description}</RichText></p>
                <p>{this.details.channel}</p>
              </Link>
          </div>
        )
    } 

    let ogimage = this.details.mini.url;
    if( this.details.mini && this.details.mini.formats && this.details.mini.formats.medium ) {
      ogimage = this.details.mini.formats.medium.url;
    }

    return (
        <div className="single-actu">
            <HtmlHead title={`News - ${this.details.title}`}
                description={this.details.description}
            >
              {
                this.details.mini &&
                <meta property="og:image" content={CONFIG.origin + ogimage}/>
              }
              <meta property="og:image:alt" content={this.details.title}/>
              <meta property="article:published_time" content={this.details.published_at}/> 
            </HtmlHead>

              <p className="date">{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.details.date))}</p>
              <h2>{this.details.title}</h2>
              {this.details.description &&
                <div>
                  <div className="long-text"><RichText>{this.details.description}</RichText></div>
                </div>
              }
              <hr/>
              <div><RichText>{this.details.article}</RichText></div>
              <div className="illustrations">{this.details.illustration && <Image src={this.details.illustration.url}/>}</div>
        </div>
    )
  }

}


export default withRouter(Actus);