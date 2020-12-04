import { Skeleton, Image, Tag } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import Note from "../components/Note";
import ArticleEnseigne from "./ArticleEnseigne";

  
class ArticleEscape extends React.Component {

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
        console.log(d);
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
                    <Skeleton/>
                  </div>
                  
                  <div>
                    <h3>Notre histoire</h3>
                    <Skeleton/>
                  </div>

                  <div>
                    <h3>Les plus</h3>
                    <Skeleton/>
                  </div>
                  
                  <div>
                    <h3>Les moins</h3>
                    <Skeleton/>
                  </div>
                  
                  <div>
                    <h3>Avant / Apres</h3>
                    <Image
                      width={100}
                      height={100}
                      src="error"
                      fallback="data:image/png;base64,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"
                    />
                  </div>


                  <ArticleEnseigne reduce={true}/>
              </div>)
    }

    
    return (
      <div>

          <h2>{this.details.name}</h2>
          {this.details.enseigne && 
            <p>Chez <Link to={"/escapegame/"+this.details.enseigne.uniquepath}>{this.details.enseigne.name}</Link></p>
          }
          <Note value={this.details.rate}/>

          <div>
            Mentions : 
          </div>

          <div>
            Tags : 
            {
              this.state.loaded && this.details.tags.filter(t => t.isVisible && !t.isMention).map(t => {
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

          {this.details.enseigne && 
            <ArticleEnseigne reduce={true} enseigneID={this.details.enseigne.id}/>
          }
      </div>
    )
  }

}


export default withRouter(ArticleEscape);