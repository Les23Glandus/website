import { Button, Menu } from "antd";
import React from "react";
import { withRouter, Link } from "react-router-dom";
import {
  SearchOutlined
} from '@ant-design/icons';
  
class Header extends React.Component {

  cur = -1;
  effects = [
    {filter:"", transform:"rotate(180deg)"},
    {filter:"blur(2px) grayscale(1)", transform:""},
    {filter:"", transform:"rotate(90deg) scaleX(-1)"},
    {filter:"blur(2px)", transform:""},
    {filter:"grayscale(1)", transform:"scaleX(0.5)"},
    {filter:"blur(8px)", transform:""},
    {filter:"grayscale(1)", transform:""},
    {filter:"", transform:"scaleX(-1)"},
    {filter:"", transform:""}
  ];

  doNotClick() {
    this.cur++;
    if( this.cur > this.effects.length - 1 ) this.cur = 0;
    var effect = this.effects[this.cur];

    let root = document.getElementById('root');
    root.style.transform = effect.transform;
    root.style.filter = effect.filter;
  }

  render() {
    let selected = [];
    if( this.props.location.pathname.indexOf("/escapegame") === 0 ) selected.push('1');
    if( this.props.location.pathname.indexOf("/jeux") === 0 ) selected.push('2');
    if( this.props.location.pathname.indexOf("/news") === 0 ) selected.push('3');
    if( this.props.location.pathname.indexOf("/about") === 0 ) selected.push('4');

    
    //transform: rotate(180deg) scaleX(-1);
    //filter: blur(2px) grayscale(1);
    
    return (
        <div className="main-header">
            <h1><Link to="/">Les Glandus</Link></h1>
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={selected}>
                <Menu.Item key="1"><Link to="/escapegame">Expériences Immersives</Link></Menu.Item>
                <Menu.Item key="2"><Link to="/jeux">Jeux de société</Link></Menu.Item>
                <Menu.Item key="3"><Link to="/news">Actualité</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/about">A Propos</Link></Menu.Item>
                <Menu.Item key="5"><Button onClick={this.doNotClick.bind(this)}>Ne pas cliquer</Button></Menu.Item>
                <Menu.Item key="6"><Link to="/escapegame"> <SearchOutlined /> </Link></Menu.Item>
            </Menu>
        </div>
    )
  }

}


export default withRouter(Header);