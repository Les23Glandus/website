import React from "react";
import { withRouter } from "react-router-dom";
import { Rate } from "antd";
  
class Note extends React.Component {

  render() {

    const desc = ['Nul', 'Bof', 'Bien', 'Trés bien', 'Excellente'];

    let v = this.props.value ? this.props.value : 3;
    
    return (
        <Rate tooltips={desc} value={v} disabled />
    )
  }

}


export default withRouter(Note);