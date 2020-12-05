import React from "react";
import { withRouter } from "react-router-dom";
import SelectionsGrid from "../components/SelectionsGrid";

  
class Selections extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div>
        
        <SelectionsGrid showAll={true}/>
          
      </div>
    )
  }

}


export default withRouter(Selections);