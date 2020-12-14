import { PageHeader } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import Actus from "../components/Actus";
import HtmlHead from "../components/HtmlHead";
import TopIllustration from "../components/meta/TopIllustration";

  
class Actu extends React.Component {

  render() {
    return (
      <div>
        <HtmlHead title={`News`}/>
          
        <div className="main-content-page">
          <PageHeader title="Actualité" onBack={() => window.location.href = "/news"}/>
          <Actus actuRef={this.props.match.params.news}/>
        </div>
      </div>
    )
  }

}


export default withRouter(Actu);