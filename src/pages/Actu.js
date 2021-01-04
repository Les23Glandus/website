import { PageHeader } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import Actus from "../components/Actus";
import ActusGrid from "../components/ActusGrid";
import EscapeLatestsTest from "../components/EscapeLatestsTests";
import HtmlHead from "../components/HtmlHead";
import TopIllustration from "../components/meta/TopIllustration";
import Page500 from "./Page500";
import "../css/actus.scss";
import Slice from "../components/meta/Slice";

  
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
      <div className="actu-main-page">
        <HtmlHead title={`News`} />
        
        <TopIllustration/>
        <Slice breath>
          <PageHeader title="Actualité" onBack={() => window.location.href = "/news"}/>
          <Actus key={this.props.match.params.news}   actuRef={this.props.match.params.news}/>
        </Slice>
        <Slice colored breath>
            <ActusGrid/> 
        </Slice>
        <Slice breath>
            <EscapeLatestsTest/>  
        </Slice>
      </div>
    )
  }

}


export default withRouter(Actu);