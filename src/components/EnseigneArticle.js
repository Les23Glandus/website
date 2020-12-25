import { Skeleton } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "./EscapeCard";
import HtmlHead from "./HtmlHead";
import "../css/enseigneArticle.scss";
import TopIllustration from "./meta/TopIllustration";
import RichText from "./meta/RichText";
import CONFIG from "../class/config";
import GoogleMaps from "./meta/GoogleMaps";

  
class EnseigneArticle extends React.Component {

  details = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false, reduce:this.props.reduce};

    if( props.details ) {
      this.details = props.details;
      this.state.loaded = true;
    }
  }

  loadDetails() {
    let strapi = new strapiConnector();

    let promise = this.props.enseigneID ? strapi.getEnseigne(this.props.enseigneID) : strapi.getEnseigneByRef(this.props.enseigneRef);
    promise.then( d => {
      this.details = d;
      this.setState({loaded:true});
    }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
    
  }

  componentDidMount() {
    if(!this.state.loaded && !this.state.error && (this.props.enseigneID || this.props.enseigneRef) ) this.loadDetails();
  }

  componentDidUpdate() {
    if(!this.state.loaded && !this.state.error && (this.props.enseigneID || this.props.enseigneRef) ) this.loadDetails();
  }

  render() {
    
    if( !this.state.loaded ) {

      return (
        <div class="enseigne-main">
              <TopIllustration/>
              <div className="article-container article-enseigne">

                  <div className="article-part">
                    <div className="left">
                      <Skeleton.Image />
                    </div>
                    <div className="right">
                        <div className="longtext">
                          <Skeleton active/>
                        </div>
                    </div>
                  </div>

                  <div className="article-part">
                    <div className="left">
                      <h3>NOTRE EXPÉRIENCE</h3>
                    </div>
                    <div className="right">
                        <div className="longtext">
                          <Skeleton active/>
                        </div>
                    </div>
                  </div>

                  <div className="article-highlight">
                    <div className="article-part">
                      <div className="left">
                        &nbsp;
                      </div>
                      <div className="right">
                          <div className="longtext">
                            <Skeleton active/>
                          </div>
                      </div>
                    </div>
                  </div>

                  <div className="article-part end">
                    <div className="left">
                      &nbsp;
                    </div>
                    <div className="right">
                        <div className="longtext">
                          <Skeleton active/>
                        </div>
                    </div>
                  </div>
              </div>
            </div>
      )
    } else {


      let jsonld = {
        "@context": "https://schema.org",
        "@type": "NewsArticle",
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": window.location.href
        },
        "headline": this.details.name,
        "image": [],
        "datePublished": this.details.published_at,
        "dateModified": this.details.updated_at,
        "author": {
          "@type": "Organization",
          "name": "Les Glandus"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Les Glandus",
          "logo": {
            "@type": "ImageObject",
            "url": CONFIG.origin + "/AMP-logo.png"
          }
        }
      };
    
      if( this.details.illustration ) jsonld["image"].push( CONFIG.origin + this.details.illustration.url);
      if( this.details.logo ) jsonld["image"].push( CONFIG.origin + this.details.logo.url);
  
      let address = [];
      if( this.details.addresses ) {
        this.details.addresses.forEach( n => {
          let pics = null;
          if( this.details.logo ) {
            if( this.details.logo.formats && this.details.logo.formats.thumbnail ) pics = CONFIG.origin + this.details.logo.formats.thumbnail.url;
            else pics = CONFIG.origin + this.details.logo.url;
          }
          address.push( {name:n.name , icone:pics, address:[n.street, n.postcode, n.town, n.pay].join(" ")} );
        });
      }


      return (
        <div class="enseigne-main">
            {
              this.props.updathead !== false &&
              <HtmlHead title={this.details.name}
                      description={this.details.introduction && this.details.introduction}
              >
                {this.details.logo && 
                  <meta property="og:image" content={CONFIG.origin + this.details.logo.url}/>
                }
                  <meta property="og:image:alt" content={this.details.name}/>
                  <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
              </HtmlHead>
            }
            
            {!this.props.embeded && <TopIllustration/>}
            <div className="article-container article-enseigne">

              <div className="article-part">
                <div className="left">
                    <div className="logo-area">
                        {this.details.logo && !this.props.embeded && <img src={this.details.logo.formats.thumbnail.url} alt={this.details.name}/>}
                        {this.details.logo && this.props.embeded && <Link to={"/escapegame/"+this.details.uniquepath}><img src={this.details.logo.formats.thumbnail.url} alt={this.details.name}/></Link>}
                    </div>
                </div>
                  <div className="right">
                      <h2>{this.details.name}</h2> 
                      
                      {
                        this.details.introduction && 
                      <RichText>{this.details.introduction && this.details.introduction}</RichText>
                      } 
                  </div>
              </div>
              
              {
                this.details.ourExperience &&
                <div className="article-part">
                  <div className="left">
                    <h3>Notre expérience</h3>
                  </div>
                  <div className="right">
                      <div><RichText>{this.details.ourExperience}</RichText></div>
                  </div>
              </div>
              }
              
              {
                this.details.url &&
                <div className="article-part">
                  <div className="left">
                    <h3>Site de l'enseigne</h3>
                  </div>
                  <div className="right">
                      <div><a href={this.details.url} target="_blank" rel="noreferrer" className="outlink">{this.details.url}</a></div>
                  </div>
              </div>
              }

              {
                this.props.embeded === false && address &&
                <div className="googlemaps">
                  <GoogleMaps address={address}/>
                </div>
              }
          
          </div>
  
            {
              this.details.escapes.length > 0 
              &&
              <div className="escpae-include">
                {this.details.escapes.filter( n => parseInt(n.id) !== parseInt(this.props.hide)).map(n => <EscapeCard key={n.id} escape={n} enseigne={this.details}/>)}
              </div>
            }
  
        </div>
      )


    }
  }

}


EnseigneArticle.defaultProps = {
  embeded: false
}


export default withRouter(EnseigneArticle);