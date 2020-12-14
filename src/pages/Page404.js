import { Result } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";

  
class Page404 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div className="a-propos main-content-page">
        <Result
          status="404"
          title="404"
          subTitle="Désolé, cette page n'existe pas. Besoin d'un indice ?"
          extra={<Link to="/">Accueil</Link>}
        />
      </div>
    )
  }

}


export default withRouter(Page404);