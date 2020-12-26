import { Image, Skeleton } from "antd";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import TopIllustration from "../components/meta/TopIllustration";
import Page500 from "./Page500";
import "../css/allEnseigne.scss";

  
class AllEnseigne extends React.Component {

  details;

  constructor(props) {
    super(props);
    this.state = {loading:true,error:false};
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    new strapiConnector().searchEnseigne({},1000)
    .then( d => {
      this.details = d;
      this.setState({loading:false});
    }).catch( e => {
      this.setState({error:true,loading:false});
    });

  }


  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
    return (
      <div>
        <TopIllustration/>
        <div className="all-enseignes">
          <h2>Toutes les enseignes en une seule liste.</h2>
          <div className="list">
            {
              this.state.loading && <Skeleton/>
            }
            {
              !this.state.loading && this.details.map( n => {
                let img = process.env.PUBLIC_URL + "/patterns/Pattern04.svg";
                if( n.logo ) {
                  if( n.logo.formats && n.logo.formats.thumbnail ) img = n.logo.formats.thumbnail.url;
                  else if (n.logo.url) img = n.logo.url;
                }
                return <div key={'c'+n.id}><Link to={"/escapegame/"+n.uniquepath}><Image src={img} alt={n.name} title={n.name} width={150} height={150}/></Link></div>} )
            }
          </div>
        </div>
      </div>
    )
  }

}


export default withRouter(AllEnseigne);