import React from "react";
import { withRouter } from "react-router-dom";
import "../../css/meta_note.scss";
  
class Note extends React.Component {

  static desc = ['Nul', 'Bof', 'Bien', 'Trés bien', 'Excellente'];


  render() {


    let v = this.props.value ? this.props.value : 3;

    if( !this.props.value ) {
      return (<span/>)
    } else {
      return (
      <span className={"note " + (this.props.light ? "light" : "dark")} title={Note.desc[Math.floor(v)]}>{v}{!this.props.compact && <i>/5</i>}</span>
      )
    }
  }

}


export default withRouter(Note);