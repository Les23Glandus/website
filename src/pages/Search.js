import { Divider, Pagination, Select } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Search from "antd/lib/input/Search";
import Layout, { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import { Option } from "antd/lib/mentions";
import React from "react";
import { withRouter } from "react-router-dom";

  
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
            <p>
              <span>Pays :</span>
              <Select defaultValue="" onChange={()=>{}}>
                <Option value="">Tous</Option>
                <Option value="France">France</Option>
                <Option value="Espagne">Espagne</Option>
                <Option value="Hongrie">Hongrie</Option>
              </Select>
            </p>

            <p>
              <span>Région :</span>
              <Select defaultValue="" onChange={()=>{}}>
                <Option value="">Toutes</Option>
                <Option value="95">95</Option>
                <Option value="77">77</Option>
                <Option value="53">53</Option>
              </Select>
            </p>
            
            <Divider orientation="left">Left Text</Divider>
            <p>
              <span>Nombre de joueur :</span>
              <Select defaultValue="" onChange={()=>{}}>
                <Option value=""> </Option>
                <Option value={1}>1</Option>
                <Option value={2}>2</Option>
                <Option value={3}>3</Option>
                <Option value={4}>4</Option>
                <Option value={5}>5</Option>
                <Option value={6}>6</Option>
                <Option value={7}>7</Option>
                <Option value={8}>8</Option>
                <Option value={9}>9</Option>
                <Option value={10}>10</Option>
                <Option value="+">10+</Option>
              </Select>
            </p>

            <Divider orientation="left">Left Text</Divider>
            <p>
              <Checkbox onChange={()=>{}}>2 joueurs</Checkbox>
            </p>
            <p>
              <Checkbox onChange={()=>{}}>Horrifique</Checkbox>
            </p>
            <Divider orientation="left">Left Text</Divider>
            <p>
              <Checkbox onChange={()=>{}}>Checkbox</Checkbox>
            </p>
            <p>
              <Checkbox onChange={()=>{}}>Checkbox</Checkbox>
            </p>
            <p>
              <Checkbox onChange={()=>{}}>Checkbox</Checkbox>
            </p>
          </Sider>
          <Content>

            <div>
              <Pagination defaultCurrent={1} total={50} />
            </div>
          </Content>
        </Layout>
      </div>
    )
  }

}


export default withRouter(SearchC);