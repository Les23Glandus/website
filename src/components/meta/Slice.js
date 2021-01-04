import React from "react";
import { withRouter } from "react-router-dom";
  
class Slice extends React.Component {

  constructor( props ) {
    super(props);
    this.c = ["slice"];
    if( this.props.breath ) this.c.push( "breath" );
    if( this.props.colored ) this.c.push( "zoning" );
    if( this.props.nopadding ) this.c.push( "nopadding" );
    
    this.b = ["container"];
    if( this.props.className ) this.b.push( this.props.className );
  }

  render() {


    return (
      <div className={this.c.join(" ")}>
        <div className={this.b.join(" ")}>
          {this.props.children && this.props.children}
        </div>
      </div>
    )
  }

}

Slice.defaultProps = {
  className: "",
  breath: false,
  colored: false,
  nopadding: false,
}

export default withRouter(Slice);