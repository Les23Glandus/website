import React from "react";
import { withRouter, Link } from "react-router-dom";
import '../css/selectionmini.scss';
  
class SelectionMini extends React.Component {

  render() {
    
    return (
        <div className="selection-mini">
          <Link to="/selection">
            <p>Name</p>
            <p>Description</p>
          </Link>
        </div>
    )
  }

}


export default withRouter(SelectionMini);