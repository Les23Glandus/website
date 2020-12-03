import React from "react";
import { withRouter } from "react-router-dom";
import { Rate } from "antd";
  
class Note extends React.Component {

  render() {

    const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];

    
    return (
        <Rate tooltips={desc} value={3} />
    )
  }

}


export default withRouter(Note);