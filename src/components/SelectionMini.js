import React from "react";
import { withRouter, Link } from "react-router-dom";
import '../css/selectionmini.scss';
  
class SelectionMini extends React.Component {

  render() {
    
    return (
        <div className="selection-mini">
          <Link to={"/selections/"+this.props.details.uniquepath}>
            <p>{this.props.details.title}</p>
            <p>{this.props.details.description}</p>
          </Link>
        </div>
    )
  }

}


export default withRouter(SelectionMini);