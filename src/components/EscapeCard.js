import React from "react";
import { Link, withRouter } from "react-router-dom";
import Note from "./Note";
import "../css/escapecard.scss";
import { Tag } from "antd";
  
class EscapeCard extends React.Component {

  constructor(props) {
    super(props);

    this.picRef = React.createRef();
  }

  componentDidMount() {
    this.updateBGY();
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

    let style = {};
    if( this.props.escape.mini ) {
      if( this.props.escape.mini.formats.small ) style.backgroundImage = `url(${this.props.escape.mini.formats.small.url})`;
      else  style.backgroundImage = `url(${this.props.escape.mini.url})`;
      //else if( this.props.escape.mini.formats.thumbnail ) style.backgroundImage = `url(${this.props.escape.mini.formats.thumbnail.url})`;
    }


    window.addEventListener('scroll', (event) => {
      this.updateBGY();
    });

    let classname = "";
    if( this.props.reduce ) classname = " reduce";
    else classname = " full";

    let enseigneuip = this.props.enseigne ? this.props.enseigne.uniquepath : "avis";

    let pays = [];
    let regions = [];
    if( this.props.escape.addresses && this.props.escape.addresses.length > 0 ) {
      this.props.escape.addresses.forEach(addr => {
        if( addr.region && regions.indexOf(addr.region.name) < 0 ) regions.push( addr.region.name );
        if( addr.pay && regions.indexOf(addr.pay.name) < 0 ) pays.push( addr.pay.name );
      });
    }
    
    return (
        <div className={"escape-card"+classname}>
            <Link to={"/escapegame/"+enseigneuip+"/"+this.props.escape.uniquepath} 
              style={style}
              ref={this.picRef}
              title={this.props.escape.description}
              className={"escape-card-mini"+classname}/>
            
            <Link to={"/escapegame/"+this.props.enseigne.uniquepath+"/"+this.props.escape.uniquepath}
              className={"escape-card-details"+classname}
            >
              <div className="flexpart-1">

                {
                  this.props.date &&
                  <p className="date">{new Intl.DateTimeFormat('fr-FR', { dateStyle: 'full' }).format(new Date(this.props.escape.date))}</p>
                }
                {
                  !this.props.reduce && pays.length > 0 
                  && 
                  <p className="region">{pays.length > 0 && pays.join(", ")}{regions.length > 0 && (' - '+regions.join(", "))}</p>
                }
                <p className="title">{this.props.escape.name}<span className="rate"><span class='separator'> - </span><Note value={this.props.escape.rate}/></span></p>
                <p className="enseigne">{this.props.enseigne.name}</p>
                
                {!this.props.reduce &&
                  <div className="tags">
                    {
                      this.props.escape.tags && this.props.escape.tags.filter(t => !t.isGold).map(t => {
                        return <Tag key={t.id}>{t.name}</Tag>
                      })
                    } 
                  </div>
                }
                {!this.props.reduce &&
                  <span>{this.props.escape.nbPlayerMin}-{this.props.escape.nbPlayerMax} joueurs</span>
                }
              </div>
              {!this.props.reduce &&
                <div className="flexpart-2">
                  <div className="description">
                    { this.props.escape.description } 
                  </div>
                </div>
              }
            </Link>
        </div>
    )
  }

}


export default withRouter(EscapeCard);