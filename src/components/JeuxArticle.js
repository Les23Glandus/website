import { Skeleton } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import HtmlHead from "./HtmlHead";
import '../css/article.scss';
import Card from "./meta/Card";
import RichText from "./meta/RichText";
import JeuxGrid from "./JeuxGrid";
import CONFIG from "../class/config";

  
class JeuxArticle extends React.Component {

  details = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
  }

  loadDetails() {
    new strapiConnector().getJeuxByRef(this.props.jeuRef)
    .then( d => {
      this.details = d;
      this.setState({loaded:true});
    }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
    
  }

  componentDidMount() {
    this.loadDetails();
  }

  render() {

    if(!this.state.loaded) {
      return (
            <div>
              <div className="article-illustration top-illustration" style={{backgroundImage:`url(${process.env.PUBLIC_URL + "/patterns/Pattern04.svg"})`}} />
              <div className="article-container article-jeux">

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
                    <div className="right">
                        <div className="longtext">
                          <Skeleton active/>
                          <Skeleton active/>
                          <Skeleton active/>
                        </div>
                    </div>
                  </div>

              </div>
            </div>
              )
    }

    //Used by google
    let jsonld = {
      "@context": "https://schema.org",
      "@type": "ReviewNewsArticle",
      "itemReviewed": {
        "@type":"Game",
        "name": this.details.name
      },
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "inLanguage": {
        "@type": "Language",
        "name": "French",
        "alternateName": "fr"
      },
      "reviewAspect":"Review",
      "abstract": this.details.description,
      "articleSection":"BoardGame",
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
    if( this.details.mini ) jsonld["image"].push( CONFIG.origin + this.details.mini.url);

    let illusUrl = this.details.illustration ? this.details.illustration.url : process.env.PUBLIC_URL + "/patterns/Pattern04.svg";

    return (
      <div>
          <HtmlHead title={this.details.name}>
              <meta property="og:image" content={CONFIG.origin + this.details.mini.url}/>
              <meta property="og:image:alt" content={this.details.name}/>
              <meta property="og:description" content={this.details.description}/> 
              <meta property="article:published_time" content={this.details.published_at}/> 
              <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
          </HtmlHead>

          {
          this.details.illustration && 
          <div className="article-illustration top-illustration" title={this.details.description} style={{backgroundImage:`url(${illusUrl})`}} />
          }

        <div className="article-container article-jeux">

          <div className="article-part">
            <div className="left">
              {
                this.details.mini && 
                <Card url="#" imageUrl={this.details.mini.url} imageTitle={this.details.description}/>
              }
            </div>
            <div className="right">
                  <div>
                    <h2>{this.details.name}</h2>
                    {this.details.editeur && 
                      <p>{this.details.editeur}</p>
                    }
                  </div>
            </div>
          </div>

          {
            this.details.description &&
            <div className="article-part">
              <div className="left">
                <h3>Description</h3>
              </div>
              <div className="right">
                <div className="longtext">
                  <RichText>{this.details.description}</RichText>
                </div>
              </div>
            </div>
          }


          
          {
            this.details.article &&
            <div className="article-part">
              <div className="both">
                <div className="longtext">
                  <RichText>{this.details.article}</RichText>
                </div>
              </div>
            </div>
          }


          <div className="article-part end">
            <div className="left">
              &nbsp;
            </div>
            <div className="right">
              &nbsp;
            </div>
          </div>
        </div>




        <div className="article-follower moretosee">
          <JeuxGrid title="A voir aussi..."/>
        </div>
      </div>
    )
  }

}


export default withRouter(JeuxArticle);