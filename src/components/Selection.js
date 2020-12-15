import { PageHeader, Skeleton } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "../components/EscapeCard";
import HtmlHead from "./HtmlHead";
import TopIllustration from './meta/TopIllustration';
import '../css/selection.scss';
import SelectionCard from "./SelectionCard";

  
class Selection extends React.Component {

  details = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false};
  }


  loadDetails() {  
    new strapiConnector().getSelectionByRef(this.props.selectionRef).then( d => {
        this.details = d;
        this.setState({loaded:true, uref:this.details.uniquepath});
      }).catch(e => {this.setState({error:true});if( typeof(this.props.onError) === "function" ) this.props.onError();} );
  }

  componentDidMount() {
    this.loadDetails();
  }

  render() {
    
    if( !this.state.loaded ) {
      return (
        <div class="selection-main">
          <TopIllustration/>
          <div className="page-back">
            <PageHeader title="Toutes nos sélections" onBack={() => window.location.href = "/selections"}/>
          </div>
          <div className="article-container article-selection">

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
          </div>
        </div>
      )
    } else {


      let jsonld = 
      {
        "@context":"https://schema.org",
        "@type":"ItemList",
        "itemListElement":[]
      }
      
      this.details.escapes.forEach( (n,i) =>  {
        let enseigne = n.enseigne ? n.enseigne.uniquepath : "avis";
        let url = window.location.origin + "/escapegame/"+enseigne+"/"+n.uniquepath;
        let pic = window.location.origin + (n.mini ? n.mini.url : "");
        jsonld.itemListElement.push(  
          {
            "@type":"ListItem",
            "position":(i+1),
            "url":url,
            "name":n.name, 
            "image":pic        
          }
        );
      });
      
      return (
        <div class="selection-main">
          
            <HtmlHead title={`Nos sélections - ${this.details.title}`}>
                <script type="application/ld+json">{JSON.stringify(jsonld)}</script>
            </HtmlHead>


            {
              this.details.image && 
              <div className="article-illustration top-illustration" title={this.details.description} style={{backgroundImage:`url(${this.details.image.url})`}} />
            }
            {
              !this.details.image && 
              <TopIllustration/>
            }
            <div className="page-back">
              <PageHeader title="Toutes nos sélections" onBack={() => window.location.href = "/selections"}/>
            </div>
            <div className="article-container article-selection">

              <div className="article-part">
                <div className="left">
                    <div className="logo-area">
                        {
                          this.details.mini && 
                          <SelectionCard details={this.details} reduce/>
                        }
                    </div>
                </div>
                <div className="right">
                    <h2>{this.details.title}</h2> 
                    <div>
                      {this.details.description && this.details.description}  
                    </div>
                </div>
              </div>

              {
                this.details.article && 
                <div className="article-part">
                  <div className="left">
                    <h3>Notre sélection</h3>
                  </div>
                  <div className="right">
                      <div>{this.details.article}</div>
                  </div>
                </div>
              }

            </div>

            {
              this.details.escapes.length > 0 
              &&
              <div className="escpae-include">
                {this.details.escapes.filter( n => n.id !== parseInt(this.props.hide)).map(n => <EscapeCard key={n.id} escape={n} enseigne={this.details}/>)}
              </div>
            }

        </div>
      )
    }
  }

}


export default withRouter(Selection);