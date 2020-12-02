import React from "react";
import { withRouter } from "react-router-dom";
  
class Header extends React.Component {

  render() {
    
    return (
        <div className="main-header">
            The page Header
        </div>
    )
  }

}


export default withRouter(Header);