import React from "react";
import { Link, withRouter } from "react-router-dom";
import "../../css/meta_card.scss";
import { RightOutlined } from '@ant-design/icons';
  
class Card extends React.Component {

  static title = React.Component;

  constructor(props) {
    super(props);
    this.picRef = React.createRef(); 
  }

  componentDidMount() {
    this.updateBGY();

    window.addEventListener('scroll', (event) => {
      this.updateBGY();
    });
  }


  getPageSize() {
    var win = window,
      doc = document,
      docElem = doc.documentElement,
      body = doc.getElementsByTagName('body')[0],
      x = win.innerWidth || docElem.clientWidth || body.clientWidth,
      y = win.innerHeight|| docElem.clientHeight|| body.clientHeight;
    return {x:x,y:y};
  };

  updateBGY() {
    if( this.picRef.current ) {
      const pos = this.picRef.current.getBoundingClientRect();

      let before = pos.top;
      let after = this.getPageSize().y - pos.top - pos.height;

      let newposY;
      if( before <= 0 ) newposY = 20;
      else if( after <= 0 ) newposY = 80;
      else newposY = 50 - Math.round( 30 * (after - before) / Math.max(Math.abs(after),Math.abs(before)) );

      this.picRef.current.style.backgroundPositionY = newposY + "%";
    }
  }

  render() {
    let pcolor = {};
    let reduceClassName = this.props.reduce ? "reduce" : "full";
    let classname = ["meta-card", reduceClassName];
    if( this.props.className ) classname.push( this.props.className );
    if( this.props.color ) {
      classname.push( "colored" );
      pcolor = {"backgroundColor":this.props.color};
    }

    let rd = Math.floor(Math.random() * 12) + 1;

    let imageUrl = this.props.imageUrl;
    if(!imageUrl) imageUrl = process.env.PUBLIC_URL + "/patterns/Pattern"+(rd<10?"0":"")+rd+".svg";

    return (
      <div className={classname.join(" ")}>

          <div className={`meta-card-mini ${reduceClassName}`}
              ref={this.picRef}
              style={{"backgroundImage":`url(${imageUrl})`}}>
          </div>
          
          <Link to={this.props.url} 
            className={`meta-card-minilink ${reduceClassName}`}
            style={pcolor}
            title={this.props.imageTitle}>
              {this.props.bigText && <p><span>{this.props.bigText}</span><span className="chevron"><RightOutlined /></span></p>}
          </Link>

          <Link to={this.props.url}
            className={`meta-card-details ${reduceClassName}`}
          >
            <div className="flexpart-1">
              {
                !this.props.reduce &&
                <p className="sup-title">{this.props.supTitle}</p>
              }
              <p className="title">{this.props.title}</p>
              <p className="sub-title">{this.props.subTitle}</p>

              {!this.props.reduce && this.props.children}
              
            </div>
            {!this.props.reduce &&
              <div className="flexpart-2">
                {!this.props.reduce && this.props.more}
              </div>
            }
          </Link>
      </div>
    )
  }

}
Card.defaultProps = {
  className: "",
  url: "",
  imageUrl: "",
  imageTitle: "",
  title: "",
  subTitle: "",
  supTitle:"",
  reduce:true,
  colorEffect:null,
  bigText:false,
}
export default withRouter(Card);