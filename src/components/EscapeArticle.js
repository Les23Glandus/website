import { Skeleton, Image, Tag } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import Note from "./meta/Note";
import ArticleEnseigne from "./EnseigneArticle";
import SelectionCard from "./SelectionCard";
import EscapeLatestsTests from "./EscapeLatestsTests";
import HtmlHead from "./HtmlHead";
import '../css/article.scss';
import '../css/escapeArticle.scss';
import Card from "./meta/Card";
import RichText from "./meta/RichText";

  
class EscapeArticle extends React.Component {

  details = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false, uref:null};

    if( props.details ) {
      this.details = props.details;
      this.state.loaded = true;
      this.state.uref = props.details.uniquepath;
    }
  }

  loadDetails() {
    let strapi = new strapiConnector();

    let promise = this.props.escapeID ? strapi.getEscape(this.props.escapeID) : strapi.getEscapeByRef(this.props.escapeRef);
    promise.then( d => {
        this.details = d;
        this.jsonld = this.generateJSONLD();
        this.setState({loaded:true, uref:this.details.uniquepath});
      }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
    
  }



  componentDidMount() {
    if(!this.state.loaded && !this.state.error && (this.props.escapeID || this.props.escapeRef)) this.loadDetails();
  }

  generateJSONLD() {
    
    //Used by google
    let jsonld = {
      "@context": "https://schema.org",
      "@type": "ReviewNewsArticle",
      "itemReviewed": {
        "@type":"Game",
        "name": this.details.name,
        "numberOfPlayers": {
          "minValue":this.details.nbPlayerMin,
          "maxValue":this.details.nbPlayerMax,
        },
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
      "reviewAspect":"Rating",
      "abstract": this.details.description,
      "articleSection":"Escape Game",
      "headline": this.details.name,
      "image": [],
      "datePublished": this.details.published_at,
      "dateModified": this.details.updated_at,
      "author": {
        "@type": "Organization",
        "name": "Les Glandus"
      },
      "reviewRating": {
        "@type": "AggregateRating",
        "ratingValue": this.details.rate,
        "bestRating": 5,
        "worstRating": 1,
        "reviewCount": Math.max(1,this.details.avantapres.length) * 5
      },
      "publisher": {
        "@type": "Organization",
        "name": "Les Glandus",
        "logo": {
          "@type": "ImageObject",
          "url": window.location.origin + "/AMP-logo.png"
        }
      }
    };
    
    //TODO add audio

    if( this.details.illustration ) jsonld["image"].push( window.location.origin + this.details.illustration.url);
    if( this.details.mini ) jsonld["image"].push( window.location.origin + this.details.mini.url);

    return jsonld;
  }

  render() {

    if(!this.state.loaded) {
      return (
            <div>
              <div className="article-illustration top-illustration" style={{backgroundImage:`url(${process.env.PUBLIC_URL + "/patterns/Pattern04.svg"})`}} />
              <div className="article-container article-escape">

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
                      <h3>Notre histore</h3>
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
                        <h3>Les plus</h3>
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
    }

    let pays = [];
    let regions = [];
    let town = null;
    if( this.details.addresses && this.details.addresses.length > 0 ) {
      this.details.addresses.forEach(addr => {
        if( addr.region && regions.indexOf(addr.region.name) < 0 ) regions.push( addr.region.name );
        if( addr.pay && regions.indexOf(addr.pay.name) < 0 ) pays.push( addr.pay.name );
      });
      if( this.details.addresses.length === 1 ) {
        town = this.details.addresses[0].town;
      }
    }

    let illusUrl = this.details.illustration ? this.details.illustration.url : process.env.PUBLIC_URL + "/patterns/Pattern04.svg";

    return (
      <div>
          <HtmlHead title={`${this.details.name}` + (this.details.enseigne ? ` - ${this.details.enseigne.name}` : "")}>
              {
                this.details.mini &&
                <meta property="og:image" content={window.location.origin + this.details.mini.url}/>
              }
              <meta property="og:image:alt" content={this.details.name}/>
              <meta property="og:description" content={this.details.description}/> 
              <meta property="article:published_time" content={this.details.published_at}/> 
              {/*og:audio*/}
              <script type="application/ld+json">{JSON.stringify(this.jsonld)}</script>
          </HtmlHead>

          {
          this.details.illustration && 
          <div className="article-illustration top-illustration" title={this.details.description} style={{backgroundImage:`url(${illusUrl})`}} />
          }

        <div className="article-container article-escape">
            {
              this.details.glandusor &&
              <div className="glandus-or">
                  <p><span>{this.details.glandusor}</span></p>
              </div>
            }

          <div className="article-part">
            <div className="left">
              {
                this.details.mini && 
                <Card url="#" imageUrl={this.details.mini.url} imageTitle={this.details.description}/>
              }
            </div>
            <div className="right">
              
                    <div className="title-flex">
                      <div>
                        {pays.length > 0 && <p className="region">{pays.length > 0 && pays.join(", ")}{regions.length > 0 && (' - '+regions.join(", "))}{town && (' - '+town)}</p>}
                        <h2>{this.details.name}</h2>
                        {this.details.enseigne && 
                          <p>Chez <Link to={"/escapegame/"+this.details.enseigne.uniquepath}>{this.details.enseigne.name}</Link></p>
                        }
                      </div>
                      <div>
                        <Note value={this.details.rate}/> 
                      </div>
                    </div>

                  <div className="tags-line">
                    {this.details.nbPlayerMax === this.details.nbPlayerMin && this.details.nbPlayerMin === 1 && <Tag>{this.details.nbPlayerMin} joueur</Tag>}
                    {this.details.nbPlayerMax === this.details.nbPlayerMin && this.details.nbPlayerMin >= 1 && <Tag>{this.details.nbPlayerMin} joueurs</Tag>}
                    {this.details.nbPlayerMax !== this.details.nbPlayerMin && <Tag>{this.details.nbPlayerMin} à {this.details.nbPlayerMax} joueurs</Tag >}
                    {
                      this.state.loaded && this.details.tags.filter(t => !t.isMention).map(t => {
                        return <Tag key={t.id}>{t.name}</Tag>
                      })
                    }
                    {
                      this.state.loaded && this.details.tags.filter(t => t.isMention).map(t => {
                          return <Tag key={t.id}>{t.name}</Tag>
                      })
                    }
                  </div>

              
                  {
                    this.details.scenario && 
                    <div className="longtext scenario"><RichText>{this.details.scenario}</RichText></div>
                  }
            </div>
          </div>

          {
            this.details.story &&
            <div className="article-part">
              <div className="left">
                <h3>Notre Histoire</h3>
              </div>
              <div className="right">
                <div className="longtext">
                  {
                    this.details.audio && 
                    <audio controls controlsList="nodownload">
                      <source src={this.details.audio.url} type="audio/mpeg"/>
                    </audio>
                  }
                  <RichText>{this.details.story}</RichText>
                </div>
              </div>
            </div>
          }


          
          {
            ( this.details.lesPlus || this.details.lesPlus ) && 
            <div className="article-highlight">
              {
                this.details.lesPlus && 
                <div className="article-part">
                  <div className="left">
                    <h3>Les plus</h3>
                  </div>
                  <div className="right">
                      <div className="longtext">
                        <RichText>{this.details.lesPlus}</RichText>
                      </div>
                  </div>
                </div>
              }
              {
                this.details.lesMoins && 
                <div className="article-part">
                  <div className="left">
                    <h3>Les moins</h3>
                  </div>
                  <div className="right">
                      <div className="longtext">
                        <RichText>{this.details.lesMoins}</RichText>
                      </div>
                  </div>
                </div>
              }
            </div>
          }


          {this.details.avantapres.length > 0 &&
            <div className="article-part">
              <div className="left">
                <h3>Avant / Aprés</h3>
              </div>
              <div className="right avantapres">
                {this.details.avantapres.map( (n,i) => {
                  let rot = ["-4deg","3deg","-1deg","10deg"];
                  return (
                    <Image
                      style={{"transform":`rotate(${rot[ i % rot.length ]})`}}
                      key={n.id}
                      width={300}
                      src={n.image.url}
                      title={n.when}
                      placeholder={
                        <Image
                          src={n.image.formats.thumbnail.url}
                          width={200}
                        />
                      }
                      />
                  )}
                )}
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




          
          
        {this.details.selections && this.details.selections.length > 0 && 
          <div className="article-follower article-selections">
            <h3>Présente dans les sélections suivantes</h3>
            <div className="flexgrid">
              {
                this.details.selections.map( n => <SelectionCard reduce key={n.id} details={n}/> )
              }
            </div>
          </div>
        }

        {this.details.enseigne && 
          <div className="article-follower zoning">
            <ArticleEnseigne reduce={true} enseigneID={this.details.enseigne.id} updathead={false} embeded hide={this.details.id}/>
          </div>
        }


        <div className="article-follower moretosee">
          <EscapeLatestsTests title="A voir aussi..."/>
        </div>
      </div>
    )
  }

}


export default withRouter(EscapeArticle);