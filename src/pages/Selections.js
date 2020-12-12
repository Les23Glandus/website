import React from "react";
import { withRouter } from "react-router-dom";
import HtmlHead from "../components/HtmlHead";
import SelectionsGrid from "../components/SelectionsGrid";

  
class Selections extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div className="a-propos main-content-page">
        
        <HtmlHead title={`Nos sélections`}/>

        <SelectionsGrid showAll={true}/>
          
      </div>
    )
  }

}


export default withRouter(Selections);