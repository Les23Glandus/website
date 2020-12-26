import { Result } from "antd";
import Form from "antd/lib/form/Form";
import Search from "antd/lib/input/Search";
import React from "react";
import { Link, withRouter } from "react-router-dom";

  
class Page404 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div className="main-content-page page-404">
        <Result
          status="404"
          title="404"
          subTitle="Désolé, cette page n'existe pas. Besoin d'un indice ?"
          extra={<Link to="/">Accueil</Link>}
        />

        <Form action="GET" target="/search">
            <Search name="q"
              onSearch={(q) => { window.location.href = "/search?q=" + encodeURI(q) } }
            />
        </Form>
      </div>
    )
  }

}


export default withRouter(Page404);