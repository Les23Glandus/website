import { PageHeader } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import Actus from "../components/Actus";

  
class Actu extends React.Component {

  render() {
    return (
      <div>
        <PageHeader title="Actualité" onBack={() => window.location.href = "/news"}/>
        <Actus actuRef={this.props.match.params.news}/>
      </div>
    )
  }

}


export default withRouter(Actu);