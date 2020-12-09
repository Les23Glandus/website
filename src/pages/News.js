import { Skeleton, Timeline } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import Actus from "../components/Actus";
import EscapeCard from "../components/EscapeCard";

  
class News extends React.Component {

  actusList = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, escapeLoaded:false, error:false, loading:true};
  }


  loadActus() {  
    new strapiConnector().getRecentActus(30).then( d => {
        this.actusList = d;
        this.loading = false;
        this.loadEscape();
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
            this.setState({loaded:true});
          }).catch();
      }
  }

  componentDidMount() {
    this.loadActus();
  }

  render() {
      if( !this.state.loaded ) {
          return (
            <div>
            <br/>
             <br/>
                <Timeline>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                    <Timeline.Item><Skeleton active avatar/></Timeline.Item>
                </Timeline>
            </div>
          );
      } else {
        return (
            <div>
            <br/>
             <br/>
                <Timeline>
                    {
                        this.actusList.map( n => {
                            if( n.channel ) return (<Timeline.Item key={"A"+n.id}><Actus reduce details={n}/></Timeline.Item>);
                            else return (<Timeline.Item key={"E"+n.id}><EscapeCard date escape={n} enseigne={n.enseigne}/></Timeline.Item>);
                        })
                    }
                    <Timeline.Item>&nbsp;</Timeline.Item>
                </Timeline>
            </div>
          );
      }
  }

}


export default withRouter(News);