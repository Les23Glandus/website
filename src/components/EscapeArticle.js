import { Skeleton, Image, Tag } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import Note from "./Note";
import ArticleEnseigne from "./EnseigneArticle";
import SelectionMini from "./SelectionMini";
import HtmlHead from "./HtmlHead";

  
class EscapeArticle extends React.Component {

  details = null;
  loading = false;

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
    if(!this.loading) {
      this.loading = true;
      let strapi = new strapiConnector();
  
      let promise = this.props.escapeID ? strapi.getEscape(this.props.escapeID) : strapi.getEscapeByRef(this.props.escapeRef);
      promise.then( d => {
          this.details = d;
          this.loading = false;
          this.setState({loaded:true, uref:this.details.uniquepath});
      }).catch( e => {
        this.loading = false;
        this.setState({error:true});
      });
    }
  }



  componentDidMount() {
    if(!this.state.loaded && !this.state.error && (this.props.escapeID || this.props.escapeRef)) this.loadDetails();
  }

  componentDidUpdate() {
    if(!this.state.loaded && !this.state.error && (this.props.enseigneID || this.props.enseigneRef) ) this.loadDetails();
  }

  render() {

    if(!this.state.loaded) {
      return (<div>
                  <h2><Skeleton title={true} paragraph={false}/></h2>
                  <p>Chez</p>

                  {this.state.loaded && 
                    <Note value={0}/>
                  }

                  <div>
                    Mentions : 
                  </div>

                  <div>
                    Tags : 
                  </div>

                  <div>
                    <h3>Scénario</h3>
                    <Skeleton active/>
                  </div>
                  
                  <div>
                    <h3>Notre histoire</h3>
                    <Skeleton active/>
                  </div>

                  <div>
                    <h3>Les plus</h3>
                    <Skeleton active/>
                  </div>
                  
                  <div>
                    <h3>Les moins</h3>
                    <Skeleton active/>
                  </div>
                  
                  <div>
                    <h3>Avant / Apres</h3>
                    <Skeleton.Image />
                  </div>


                  <ArticleEnseigne reduce={true}/>
              </div>)
    }

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
          "url": window.location.origin + "/AMP-logo.png"
        }
      }
    };
    
    if( this.details.illustration ) jsonld["image"].push( window.location.origin + this.details.illustration.url);
    if( this.details.mini ) jsonld["image"].push( window.location.origin + this.details.mini.url);

    return (
      <div>
          <HtmlHead title={`${this.details.name}` + (this.details.enseigne ? ` - ${this.details.enseigne.name}` : "")}>
              <meta property="og:image" content={window.location.origin + this.details.mini.url}/>
              <meta property="og:description" content={this.details.description && this.details.description}/> 
              <meta property="article:published_time" content={this.details.published_at}/> 
              {/*og:audio*/}
              <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
          </HtmlHead>
          <h2>{this.details.name}</h2>
          {this.details.enseigne && 
            <p>Chez <Link to={"/escapegame/"+this.details.enseigne.uniquepath}>{this.details.enseigne.name}</Link></p>
          }
          <Note value={this.details.rate}/>

        <div>
          {this.details.nbPlayerMax === this.details.nbPlayerMin && this.details.nbPlayerMin === 1 && <span>Pour {this.details.nbPlayerMin} joueur</span>}
          {this.details.nbPlayerMax === this.details.nbPlayerMin && this.details.nbPlayerMin >= 1 && <span>A {this.details.nbPlayerMin} joueurs</span>}
          {this.details.nbPlayerMax !== this.details.nbPlayerMin && <span>De {this.details.nbPlayerMin} à {this.details.nbPlayerMax} joueurs</span>}
        </div>

          <div>
            Mentions : 
            {
              this.state.loaded && this.details.tags.filter(t => t.isMention).map(t => {
                  return <Tag key={t.id}>{t.name}</Tag>
              })
            }
          </div>

          <div>
            Tags : 
            {
              this.state.loaded && this.details.tags.filter(t => !t.isMention).map(t => {
                  return <Tag key={t.id}>{t.name}</Tag>
              })
            }
          </div>

          {
            this.details.scenario && 
            <div>
              <h3>Scénario</h3>
              <div>{this.details.scenario}</div>
            </div>
          }
          
          {
            this.details.story && 
            <div>
              <h3>Notre histoire</h3>
              <div>{this.details.story}</div>
            </div>
          }
          
          {
            this.details.lesPlus && 
            <div>
              <h3>Les plus</h3>
              <div>{this.details.lesPlus}</div>
            </div>
          }
          
          {
            this.details.lesMoins && 
            <div>
              <h3>Les moins</h3>
              <div>{this.details.lesMoins}</div>
            </div>
          }
          
          {this.details.avantapres.length > 0 &&
            <div>
              <h3>Avant / Apres</h3>
              {this.details.avantapres.map( n => 
                <Image
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
            </div>
          }
          
          {this.details.selections && this.details.selections.length > 0 && 
            <div>
              <h3>Dans nos sélections</h3>
                {
                  this.details.selections.map( n => <SelectionMini key={n.id} details={n}/> )
                }
            </div>
          }

          {this.details.enseigne && 
            <ArticleEnseigne reduce={true} enseigneID={this.details.enseigne.id} updathead={false}/>
          }
      </div>
    )
  }

}


export default withRouter(EscapeArticle);