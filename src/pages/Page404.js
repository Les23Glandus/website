import { Button, Result } from "antd";
import React from "react";
import { withRouter } from "react-router-dom";

  
class Page404 extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div className="a-propos main-content-page">
        <Result
          status="404"
          title="404"
          subTitle="Sorry, the page you visited does not exist."
          extra={<Button type="primary">Back Home</Button>}
        />
      </div>
    )
  }

}


export default withRouter(Page404);