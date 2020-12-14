import React from "react";
import { withRouter } from "react-router-dom";
  
class Note extends React.Component {

  render() {

    const desc = ['Nul', 'Bof', 'Bien', 'Trés bien', 'Excellente'];

    let v = this.props.value ? this.props.value : 3;
    
    return (
        <span className="note" title={desc[Math.floor(v)]}>{v}<i>/5</i></span>
    )
  }

}


export default withRouter(Note);