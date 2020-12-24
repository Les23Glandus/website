import React from "react";
import { Link, withRouter } from "react-router-dom";
import "../../css/meta_card.scss";
import { RightOutlined } from '@ant-design/icons';
import { Skeleton } from "antd";
  
class Card extends React.Component {

  static title = React.Component;

  constructor(props) {
    super(props);
    this.picRef = React.createRef(); 

    let rd = Math.floor(Math.random() * 12) + 1;
    this.defaultpic = process.env.PUBLIC_URL + "/patterns/Pattern"+(rd<10?"0":"")+rd+".svg";
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

      let before = pos.top + pos.height;;
      let after = this.getPageSize().y - pos.top;// - pos.height;

      console.log(before, after);

      let newposY;
      const marge = 0;
      if( before <= 0 ) newposY = marge;
      else if( after <= 0 ) newposY = 100 - marge;
      else newposY = 50 - Math.round( (50-marge) * (after - before) / Math.max(Math.abs(after),Math.abs(before)) );

      this.picRef.current.style.backgroundPositionY = newposY + "%";
    }
  }

  render() {
    let pcolor = {};
    let reduceClassName = this.props.reduce ? "reduce" : "full";
    if( this.props.compact ) reduceClassName += " compact";
    let classname = ["meta-card", reduceClassName];
    if( this.props.className ) classname.push( this.props.className );
    if( this.props.color ) {
      classname.push( "colored" );
      pcolor = {"backgroundColor":this.props.color};
    }


    let imageUrl = this.props.imageUrl;
    if(!imageUrl) imageUrl = this.defaultpic;
    return (
      <div className={classname.join(" ")}>

          <div className={`meta-card-mini ${reduceClassName}`}
              ref={this.picRef}
              style={{"backgroundImage":`url(${imageUrl})`}}>
          </div>

          {
            (!this.props.url || this.props.url.indexOf("#") === 0) && 
            <a href={this.props.url} onClick={this.props.onClick}
              className={`meta-card-minilink ${reduceClassName}`}
              style={pcolor}
              title={this.props.imageTitle}>
                {this.props.bigText && <p><span>{this.props.bigText}</span>{ this.props.arrow && <span className="chevron"><RightOutlined /></span>}</p>}
            </a>
          }
          {
            (this.props.url && this.props.url.indexOf("#") !== 0) && 
            <Link to={this.props.url} onClick={this.props.onClick}
              className={`meta-card-minilink ${reduceClassName}`}
              style={pcolor}
              title={this.props.imageTitle}>
                {this.props.bigText && <p><span>{this.props.bigText}</span>{ this.props.arrow && <span className="chevron"><RightOutlined /></span>}</p>}
            </Link>
          }
          

          <Link to={this.props.url} onClick={this.props.onClick}
            className={`meta-card-details ${reduceClassName}`}
          >
            <div className="flexpart-left">
              {
                !this.props.reduce &&
                <p className="sup-title" title={this.props.supTitle}>{this.props.supTitle}</p>
              }
              
              {this.props.preview && <Skeleton title active paragraph={false}/>}
              {!this.props.preview && <p className="title">{this.props.title}</p>}
              <p className="sub-title">{this.props.subTitle}</p>

              {!this.props.reduce && this.props.children}
              
            </div>
            {!this.props.reduce &&
              <div className="flexpart-2">
                {!this.props.reduce && this.props.more}
                {!this.props.reduce && this.props.preview && <Skeleton active/>}
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
  compact:false,
  colorEffect:null,
  bigText:false,
  arrow:true,
  onClick:null,
  preview:false,
}
export default withRouter(Card);