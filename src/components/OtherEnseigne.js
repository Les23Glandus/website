import React from "react";
import { withRouter } from "react-router-dom";
import Card from "./meta/Card";
  
class OtherEnseigne extends React.Component {

  render() {

    return (
      <div className="browse-enseigne">
          <h3>Les enseignes</h3>
          <div className="flexgrid grid-actus">
            <Card className="toenseigne-card"
                reduce={true}
                url={"/entreprise/"}
                bigText="Voir toutes les enseignes"
                title={""}
                compact
                arrow={false}
                imageUrl={null}
                imageTitle={""}
                more={""}
                color={null}
            ></Card>
          </div>
      </div>
    )
  }

}


export default withRouter(OtherEnseigne);