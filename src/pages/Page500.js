import { Result } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import ShareLinks from '../components/meta/ShareLinks';

  
class Page404 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div className="a-propos main-content-page">
        <Result
          status="500"
          title="Maintenance en cours"
          subTitle="Désolé, on bloque sur une énigme, merci de revenir dans quelques instants !"
          extra={<div>En attendant, <ShareLinks/></div>}
        />
      </div>
    )
  }

}


export default withRouter(Page404);