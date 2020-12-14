import React from "react";
import { withRouter } from "react-router-dom";
import "../../css/meta_note.scss";
  
class Note extends React.Component {

  render() {

    const desc = ['Nul', 'Bof', 'Bien', 'Trés bien', 'Excellente'];

    let v = this.props.value ? this.props.value : 3;

    let style = {"backgroundImage":`url(${process.env.PUBLIC_URL}/picture/gland.svg)`};

    return (
        <span className="note" title={desc[Math.floor(v)]} style={style}>{v}<i>/5</i></span>
    )
  }

}


export default withRouter(Note);