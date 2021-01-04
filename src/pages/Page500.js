import { Result } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import ShareLinks from '../components/meta/ShareLinks';
import Slice from "../components/meta/Slice";

  
class Page404 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <Slice>
        <Result
          status="500"
          title="Maintenance en cours"
          subTitle="Désolé, on bloque sur une énigme, merci de revenir dans quelques instants !"
          extra={<div>En attendant, <ShareLinks/></div>}
        />
      </Slice>
    )
  }

}


export default withRouter(Page404);