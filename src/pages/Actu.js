import { PageHeader } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import Actus from "../components/Actus";
import HtmlHead from "../components/HtmlHead";

  
class Actu extends React.Component {

  render() {
    return (
      <div className="main-content-page">
        <HtmlHead title={`News`}/>
        <PageHeader title="Actualité" onBack={() => window.location.href = "/news"}/>
        <Actus actuRef={this.props.match.params.news}/>
      </div>
    )
  }

}


export default withRouter(Actu);