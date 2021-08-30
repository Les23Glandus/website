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
import TopIllustration from "./meta/TopIllustration";
import CONFIG from "../class/config";
import Slice from "./meta/Slice";
import showdown from "showdown";
import {isMobile} from 'react-device-detect';
import ReactGA from 'react-ga';

  
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

  handleStartAudio() {
    ReactGA.event( {category:"audio", action:"Click", label:"Click sur audio"} );
  }

  componentDidMount() {
    if(!this.state.loaded && !this.state.error && (this.props.escapeID || this.props.escapeRef)) this.loadDetails();
  }

  generateJSONLD() {

    var converter = new showdown.Converter();
    let scen = converter.makeHtml( this.details.scenario );
    let descr = converter.makeHtml( this.details.description );

    if( scen ) scen = scen.replace(/(<([^>]+)>)/gi," ");
    if( descr ) descr = descr.replace(/(<([^>]+)>)/gi," ");


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
      "abstract": descr ? descr : scen,
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
        "worstRating": 0,
        "reviewCount": Math.max(1,this.details.avantapres ? this.details.avantapres.length : 1) * 5
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

    
    let jsonldalt = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": this.details.name,
      "brand": {
        "@type":"Organization",
        "name": this.details.enseigne ? this.details.enseigne.name : "",
      },
      "description": scen,
      "image": [],
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": this.details.rate,
        "bestRating": 5,
        "worstRating": 0,
        "reviewCount": Math.max(1,this.details.avantapres ? this.details.avantapres.length : 1) * 5
      },
      "review": {
        "@type":"Review",
        "author": {
          "@type": "Organization",
          "name": "Les Glandus"
        },
        "reviewBody": descr,
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": this.details.rate,
          "bestRating": 5,
          "worstRating": 0
        },
        "itemReviewed": {
          "@type":"Product",
          "name": this.details.name,
          "brand": this.details.enseigne ? this.details.enseigne.name : "",
          "image": [],
          "description": scen,
          "url": this.details.enseigne ? this.details.enseigne.url : "",
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": this.details.rate,
            "bestRating": 5,
            "worstRating": 0,
            "reviewCount": Math.max(1,this.details.avantapres ? this.details.avantapres.length : 1) * 5
          },
        }
      }
    };
    
    if( this.details.mini ) {
      jsonld["image"].push( CONFIG.origin + this.details.mini.url);
      jsonldalt["image"].push( CONFIG.origin + this.details.mini.url);
      jsonldalt["review"]["itemReviewed"]["image"].push( CONFIG.origin + this.details.mini.url);
    } 

    return [jsonld, jsonldalt];
  }

  render() {

    if(!this.state.loaded) {
      return (
            <div>
              <div className="article-illustration top-illustration" style={{backgroundImage:`url(${process.env.PUBLIC_URL + "/patterns/Pattern04.svg"})`}} />
              <Slice breath>

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
              </Slice>
              <Slice breath colored>

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
                </Slice>
            </div>
              )
    }

    let pays = [];
    let regions = [];
    let regionID = [];
    let town = [];
    let regroupements = [];
    if( this.details.addresses && this.details.addresses.length > 0 ) {
      this.details.addresses.forEach(addr => {
        if( addr.pay && pays.indexOf(addr.pay.name) < 0 ) pays.push( addr.pay.name );
        if( addr.region && regions.indexOf(addr.region.name) < 0 ) regions.push( addr.region.name );
        if( addr.town && regions.indexOf(addr.town) < 0 && town.indexOf(addr.town) < 0 ) town.push( addr.town );
        if( addr.regroupement && regroupements.indexOf(addr.regroupement.id) < 0 ) regroupements.push( addr.regroupement.id );
        if( addr.region && regionID.indexOf(addr.region.id) < 0 ) regionID.push( addr.region.id );
      });
    }

    let illusUrl = this.details.illustration ? this.details.illustration.url : process.env.PUBLIC_URL + "/patterns/Pattern04.svg";
    if( isMobile && this.details.illustration && this.details.illustration.formats && this.details.illustration.formats.medium ) { 
      illusUrl = this.details.illustration.formats.medium.url;
    }
    let ogimage = this.details.mini.url;
    if( this.details.mini && this.details.mini.formats && this.details.mini.formats.medium ) {
      ogimage = this.details.mini.formats.medium.url;
    }

    return (
      <div>
          <HtmlHead title={`${this.details.name}` + (this.details.enseigne ? ` - ${this.details.enseigne.name}` : "")}
                  description={this.details.description ? this.details.description : this.details.scenario  }
          >
              {
                this.details.mini &&
                <meta property="og:image" content={CONFIG.origin + ogimage}/>
              }
              <meta property="og:image:alt" content={this.details.name}/>
              <meta property="article:published_time" content={this.details.published_at}/> 
              {
                this.details.audio && 
                <meta property="og:audio" content={CONFIG.origin +  this.details.audio.url} />
              }
              {
                this.jsonld.map( (jsonld,ndx) => <script key={ndx} type="application/ld+json">{JSON.stringify(jsonld)}</script>)
              }
          </HtmlHead>

          {
          this.details.illustration && 
          <div className="article-illustration top-illustration" title={this.details.description} style={{backgroundImage:`url(${illusUrl})`}} />
          }
          {
            !this.details.illustration && 
            <TopIllustration/>
          }

        <Slice breath>

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
                          {pays.length > 0 && <p className="region">{pays.length > 0 && pays.join(", ")}{regions.length > 0 && (' - '+regions.join(", "))}{town.length > 0 && (' - '+town.join(", "))}</p>}
                          <h2>{this.details.name} {(this.details.isOpen === false || (this.details.enseigne && this.details.enseigne.isOpen === false)) && <span className="closed-info">(Fermée)</span>}</h2>
                          {this.details.enseigne && 
                            <p>Chez <Link to={"/escapegame/"+this.details.enseigne.uniquepath}>{this.details.enseigne.name}</Link>
                            {
                              this.details.date && <span>&nbsp;|&nbsp;Testé en {this.details.date.substring(0,4)}</span>
                            }
                            </p>
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
                        this.state.loaded && this.details.tags && this.details.tags.filter(t => t.isMention).sort((a,b) => { return !b.name ? 1 : a.name.localeCompare(b.name);} ).map(t => {
                            return <Tag key={t.id} title={t.description} className={t.isMention ? "mention" : ""}>{t.name}</Tag>
                        })
                      }
                      {
                        this.state.loaded && this.details.tags && this.details.tags.filter(t => !t.isMention && !t.isGold).sort((a,b) => { return !b.name ? 1 : a.name.localeCompare(b.name);} ).map(t => {
                          return <Tag key={t.id} title={t.description}>{t.name}</Tag>
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
                      <audio controls controlsList="nodownload" onPlay={this.handleStartAudio}>
                        <source src={this.details.audio.url} type="audio/mpeg"/>
                      </audio>
                    }
                    <RichText>{this.details.story}</RichText>
                  </div>
                </div>
              </div>
            }

            
            
            {
              this.details.paragraph && 
              this.details.paragraph.map( n => 
                <div className="article-part" key={n.id}>
                  <div className="left">
                    <h3>{n.title}</h3>
                  </div>
                  <div className="right">
                    <div className="longtext">
                      <RichText>{n.article}</RichText>
                    </div>
                  </div>
                </div>
                )
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


            {this.details.avantapres && this.details.avantapres.length > 0 &&
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
        </Slice>


        {this.details.selections && this.details.selections.length > 0 && 
          <Slice className="in-selection">
            <h3>Présente dans {this.details.selections.length === 1 ? "la sélection" : "les sélections suivantes"} :</h3>
            <div className="flexgrid">
              {
                this.details.selections.map( n => <SelectionCard reduce key={n.id} details={n}/> )
              }
            </div>
          </Slice>
        }

        {this.details.enseigne && 
          <Slice colored nopadding>
            <ArticleEnseigne reduce={true} enseigneRef={this.details.enseigne.uniquepath} updathead={false} embeded hide={this.details.id}/>
          </Slice>
        }


        <Slice breath>
          <EscapeLatestsTests title="A voir aussi dans le coin..." notID={this.details.id} regroupement={regroupements} 
          notEnseingeID={this.details.enseigne ? this.details.enseigne.id : null}
          nbCards={7}
          region={regionID}
          tagslist={this.details.tags ? this.details.tags.map( n => n.id ) : []}/>
        </Slice>
        </div>
    )
  }

}


export default withRouter(EscapeArticle);