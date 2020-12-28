import { Skeleton, Switch, Timeline } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import ActusCard from "../components/ActusCard";
import EscapeCard from "../components/EscapeCard";
import TopIllustration from "../components/meta/TopIllustration";
import Page500 from "./Page500";

  
class News extends React.Component {

  actusList = null;
  includeEscapes = false;

  constructor(props) {
    super(props);
    this.state = {loaded:false, escapeLoaded:false, error:false, loading:true};
  }


  loadActus() {  
    this.actusList = null;
    this.setState({loading:true, loaded:false});
    new strapiConnector().getRecentActus(30).then( d => {
        this.actusList = d;
        this.loading = false;
        if( this.includeEscapes ) {
          this.loadEscape();
        } else {
          this.addDateInList( this.actusList );
          this.setState({loaded:true,loading:false});
        }
    }).catch( e => {
      this.loading = false;
      this.setState({error:true});
    });
  }

  loadEscape() {
      //get last actu date
      if( this.actusList.length > 0 ) {
          let date = this.actusList[ this.actusList.length - 1 ].date;

          const today = new Date()
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)

          new strapiConnector().getEscapeBetweenDate(date, tomorrow.toISOString().slice(0,10) )
          .then( l => {
            if( l.length > 0 ) {
                this.actusList = this.actusList.concat( l ).sort( (a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                this.setState({loading:false});
            }
            this.addDateInList( this.actusList );
            this.setState({loaded:true});
          }).catch();
      }
  }

  addDateInList(list) {
    //{id, label, isDate}
    let prev = null;
    for( let i = list.length - 1; i >= 0; i-- ) {
      let Y = (new Date(list[i].date)).getFullYear();
      if( Y !== prev ) {
        list.splice(i+1,0,{id:Y, label:Y, isDate:true});
      }
      prev = Y;
    }
  }

  componentDidMount() {
    this.loadActus();
  }

  onSwitchChange(value) {
    if( this.actusList !== null ) {
      this.includeEscapes = value;
      this.loadActus();
    }
  }

  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
      if( !this.state.loaded ) {
          return (
            <div>
              <TopIllustration/>
              <div className="main-content-page">
                <div className="toggle-actu">
                  <Switch size="small" checked={this.includeEscapes} loading title="Afficher nos tests dans la timeline"/> Inclure les tests
                </div>
                <Timeline>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                </Timeline>
              </div>
            </div>
          );
      } else {
        return (
            <div>
              <TopIllustration/>
              <div className="main-content-page">
                <div className="toggle-actu">
                  <Switch onChange={this.onSwitchChange.bind(this)} size="small" checked={this.includeEscapes} title="Afficher nos tests dans la timeline"/> Inclure les tests
                </div>
                <Timeline>
                    {
                        this.actusList.map( n => {
                            if( n.isDate ) return (<Timeline.Item key={"D"+n.id}><h2>{n.label}</h2></Timeline.Item>);
                            else if( n.channel ) return (<Timeline.Item key={"A"+n.id}><ActusCard details={n}/></Timeline.Item>);
                            else return (<Timeline.Item key={"E"+n.id}><EscapeCard date escape={n} enseigne={n.enseigne} reduce compact/></Timeline.Item>);
                        })
                    }
                    <Timeline.Item>&nbsp;</Timeline.Item>
                </Timeline>
              </div>
            </div>
          );
      }
  }

}


export default withRouter(News);