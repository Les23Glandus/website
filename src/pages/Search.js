import { Divider, Select } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Search from "antd/lib/input/Search";
import Layout, { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Option } from "antd/lib/mentions";
import React from "react";
import { withRouter } from "react-router-dom";
import EscapeCard from "../components/EscapeCard";

  
class SearchC extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    
    return (
      <div>

        <div>
          Liste des Presets
          <div>
            Paris
          </div>
          <div>
            Toulouse
          </div>
        </div>

        <Divider/>

        <div>
          <div>
            <label>Sort by</label>
            <Select defaultValue="date" onChange={()=>{}}>
              <Option value="date">Date</Option>
              <Option value="rank">Note</Option>
              <Option value="alpha">Nom</Option>
            </Select>
          </div>
          <div>
            <Search/>
          </div>
        </div>

        <Layout>
          <Sider theme="dark">
                
          <span>Pays :</span>
                <Select defaultValue="" onChange={()=>{}}>
                  <Option value="">Tous</Option>
                  <Option value="France">France</Option>
                  <Option value="Espagne">Espagne</Option>
                  <Option value="Hongrie">Hongrie</Option>
                </Select>

                <span>Région :</span>
                <Select defaultValue="" onChange={()=>{}}>
                  <Option value="">Toutes</Option>
                  <Option value="95">95</Option>
                  <Option value="77">77</Option>
                  <Option value="53">53</Option>
                </Select>

                
                <Divider orientation="left">Left Text</Divider>
                <span>Nombre de joueur :</span>
                <Select defaultValue="" onChange={()=>{}}>
                  <Option value=""> </Option>
                  <Option>1</Option>
                  <Option>2</Option>
                  <Option>3</Option>
                  <Option>4</Option>
                  <Option>5</Option>
                  <Option>6</Option>
                  <Option>7</Option>
                  <Option>8</Option>
                  <Option>9</Option>
                  <Option>10</Option>
                  <Option>10+</Option>
                </Select>

                <Divider orientation="left">Left Text</Divider>
                <Checkbox onChange={()=>{}}>2 joueurs</Checkbox>
                <Checkbox onChange={()=>{}}>Horrifique</Checkbox>

                <Divider orientation="left">Left Text</Divider>
                <Checkbox onChange={()=>{}}>Checkbox</Checkbox>
                <Checkbox onChange={()=>{}}>Checkbox</Checkbox>
                <Checkbox onChange={()=>{}}>Checkbox</Checkbox>
          </Sider>
          <Content>

                <EscapeCard/>
                <EscapeCard/>
                <EscapeCard/>

          </Content>
        </Layout>
      </div>
    )
  }

}


export default withRouter(SearchC);