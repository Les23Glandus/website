import { Menu } from "antd";
import React from "react";
import { withRouter, Link } from "react-router-dom";
  
class Header extends React.Component {

  render() {
    
    return (
        <div className="main-header">
            <h1><Link to="/">Les Glandus</Link></h1>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item key="1"><Link to="/search">Expérience Immersive</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/boardgame">Jeux de société</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/about">About</Link></Menu.Item>
            </Menu>
        </div>
    )
  }

}


export default withRouter(Header);