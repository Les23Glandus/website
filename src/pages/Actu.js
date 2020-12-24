import { PageHeader } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import Actus from "../components/Actus";
import HtmlHead from "../components/HtmlHead";
import TopIllustration from "../components/meta/TopIllustration";
import Page500 from "./Page500";
import "../css/actus.scss";

  
class Actu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {error:false};
  }
  
  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
    
    return (
      <div>
        <HtmlHead title={`News`} />
        
        <TopIllustration/>
        <div className="main-content-page">
          <PageHeader title="Actualité" onBack={() => window.location.href = "/news"}/>
          <Actus actuRef={this.props.match.params.news}/>
        </div>
      </div>
    )
  }

}


export default withRouter(Actu);