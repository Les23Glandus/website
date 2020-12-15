import React from "react";
import { withRouter } from "react-router-dom";
import Card from "./meta/Card";
  
class SelectionCard extends React.Component {

  static mapColor = {"Black":"#00000082",
                    "Gold":"#C08A0082",
                    "Red":"#C0000082",
                    "Orange":"#C05C0082",
                    "Green":"#00C03682",
                    "Aqua":"#00C09E82",
                    "Cyan":"#0092C082",
                    "Blue":"#0013C082",
                    "Purple":"#5500C082",
                    "Pink":"#BC00C082",
                  };

  render() {

    let imageUrl;
    if( this.props.details.mini ) {
      if( this.props.details.mini.formats.small ) imageUrl = this.props.details.mini.formats.small.url
      else  imageUrl = this.props.details.mini.url;
    }
    
    let color;
    if( this.props.details.color && SelectionCard.mapColor[ this.props.details.color ] ) {
      color = SelectionCard.mapColor[ this.props.details.color ];
    }

    return (
      
      <Card className="selection-card"
          reduce={this.props.reduce ? true : false}
          url={"/selections/"+this.props.details.uniquepath}
          bigText={this.props.details.title}
          subTitle={""}
          supTitle={""}
          imageUrl={imageUrl}
          imageTitle={this.props.details.description}
          more={""}
          color={color}
      
      ></Card>
    )
  }

}


export default withRouter(SelectionCard);