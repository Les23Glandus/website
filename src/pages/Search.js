import { Divider, Form, Select, Skeleton, Spin } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import Layout, { Content } from "antd/lib/layout/layout";
import Sider from "antd/lib/layout/Sider";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "../components/EscapeCard";
import HtmlHead from "../components/HtmlHead";

  
class SearchC extends React.Component {

  tagslist = null;
  payslist = null;
  regionlist = null;

  constructor(props) {
    super(props);
    this.state = {loaded:false, error:false, regionList:null, escapeList:null, presetList:null};

    this.paysRef = React.createRef();
    this.formRef = React.createRef();
    this.sortformRef = React.createRef();
    this.regionRef = React.createRef();
  }

  componentDidMount() {
    this.loadFilters();
  }

  loadFilters() {
    let strapi = new strapiConnector();

    strapi.getTags()
    .then( d => {
        this.tagslist = d;
        if(this.payslist !== null && this.tagslist !== null) {
          this.setState({loaded:true});
          this.onFilterChange();
        }
    }).catch( e => {
      this.tagslist = [];
      this.setState({error:true});
    });

    strapi.getPays()
    .then( d => {
        this.payslist = d;
        if(this.payslist !== null && this.tagslist !== null) {
          this.setState({loaded:true});
          this.onFilterChange();
        }
    }).catch( e => {
      this.payslist = [];
      this.setState({error:true});
    });

    
    strapi.getFilterPresets()
    .then( d => {
      this.setState({presetList:d});
    }).catch( e => {
      this.setState({presetList:[]});
    });
  }


  /**
   * 
   */
  onFilterChange() {
    //Buidl query
    let query = {};
    let filter = this.formRef.current.getFieldsValue();
    console.log(JSON.stringify(filter));
    let sort = this.sortformRef.current.getFieldsValue("sort");
    let reg = /^tags-(\d+)$/;
    Object.keys( filter ).forEach((k) => {
      if( filter[k] !== undefined && filter[k] !== false ) {
        let mtch = reg.exec(k);
        if( mtch ) {
          let tagId = mtch[1];
          if( !query["tags.id"] ) query["tags.id"] = [];
          query["tags.id"].push( tagId );
        } else if( k === "gold" ) {
          if( !query["tags.id"] ) query["tags.id"] = [];
          query["tags.id"] = query["tags.id"].concat( filter[k] );
        } else if( k === "nbplayer" ) {
          query["nbPlayerMin_lte"] = filter[k];
          query["nbPlayerMax_gte"] = filter[k];
        } else {
          query[ k ] = filter[k];
        }
      }
    });

    this.setState({loading:true});
    new strapiConnector().searchEscapes( query, 300, 0, sort.sort )
    .then( d => {
      d = this.reduceListPerTags(d, query["tags.id"]);
      this.setState({escapeList:d,loading:false});
    }).catch( e => {
      this.setState({error:true,loading:false});
    });
  }

  /**
   * 
   * @param {*} list 
   * @param {*} tags 
   */
  reduceListPerTags(list, tags) {
    if( !tags || tags.length <= 1 ) return list;

    return list.map( n => {
          if(!n["t"]) n["t"] = 0;
          n.tags.forEach( t => {if( tags.indexOf(t.id) >= 0 ) n["t"]++;});
          return n;
        }).filter( n => n["t"] === tags.length);
  }
  
  
  /**
   * 
   * @param {*} selectedPaysId 
   */
  onPaysChange(selectedPaysId) {
    let p = this.payslist.find( n => n.id === selectedPaysId );
    let r = null;
    if( p ) r = p.regions;
    this.setState({regionList:r});
    this.formRef.current.setFieldsValue({"enseigne.addresses.region.id":[]});     
    this.onFilterChange();
  }


  /**
   * 
   * @param {*} setup 
   */
  setFilterValue(setup) {
    this.formRef.current.resetFields();
    if( setup["enseigne.addresses.pay.id"] ) this.onPaysChange(setup["enseigne.addresses.pay.id"]);
    this.formRef.current.setFieldsValue(setup);
    this.onFilterChange();
  }


  /**
   * 
   */
  render() {
    if( !this.state.loaded ) {
      return (
        <div>
          <div>
            <Skeleton active/>
          </div>

          <Layout>
            <Sider><Skeleton active/></Sider>
            <Content>
                <Skeleton active avatar={true}/>
                <Skeleton active avatar={true}/>
                <Skeleton active avatar={true}/>
            </Content>
          </Layout>
        </div>
      )
    }
    

    return (
      <div>
        
          <HtmlHead title={`Recherche`}/>
          {
            !this.state.presetList && 
            <div>
              <Skeleton active/>
            </div>  
          }
          {
            this.state.presetList && 
            <div>
            {
              this.state.presetList.presets.map( n => 
                <div>
                  <p>{n.name}</p>
                  <p>{n.description}</p>
                  <button onClick={()=>{this.setFilterValue( n.preset );}}>Voir les salles</button>
                </div>
              )
            }
            </div>  
          }








        <Divider/>

        <div>
          <div>
            <Form ref={this.sortformRef}>
              <Form.Item label="Trier par" name="sort" initialValue="date:DESC">
                <Select onChange={this.onFilterChange.bind(this)}>
                  <Select.Option value="date:DESC">Date</Select.Option>
                  <Select.Option value="rate:DESC,date:DESC">Note</Select.Option>
                  <Select.Option value="name:ASC">Nom</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </div>
        </div>

        <Layout>
          <Sider>
            <Form ref={this.formRef}>
              <Divider orientation="left">Pays</Divider>
              <div>
                <Form.Item label="Pays" name="enseigne.addresses.pay.id">
                  <Select onChange={this.onPaysChange.bind(this)} ref={this.paysRef}>
                    <Select.Option value={false}>Tous</Select.Option>
                    {
                      this.payslist.map( n => 
                        <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                        )
                    }
                  </Select>
                </Form.Item>
              </div>

              <div style={{display:(this.state.regionList === null || this.state.regionList.length <= 0 ? "none" : "block")}}>
                <Form.Item label="Régions" name="enseigne.addresses.region.id">
                  <Select onChange={this.onFilterChange.bind(this)} mode="multiple" placeholder="Régions" ref={this.regionRef}>
                    {
                      this.state.regionList !== null && this.state.regionList.map( n => 
                        <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                        )
                    }
                  </Select>
                </Form.Item>
              </div>
              
              <Divider orientation="left"></Divider>
              <div>
                <Form.Item label="Nombre de joueurs" name="nbplayer">
                  <Select onChange={this.onFilterChange.bind(this)}>
                    <Select.Option value=""> </Select.Option>
                    <Select.Option value={1}>1</Select.Option>
                    <Select.Option value={2}>2</Select.Option>
                    <Select.Option value={3}>3</Select.Option>
                    <Select.Option value={4}>4</Select.Option>
                    <Select.Option value={5}>5</Select.Option>
                    <Select.Option value={6}>6</Select.Option>
                    <Select.Option value={7}>7</Select.Option>
                    <Select.Option value={8}>8</Select.Option>
                    <Select.Option value={9}>9</Select.Option>
                    <Select.Option value={10}>10</Select.Option>
                    <Select.Option value="+">10+</Select.Option>
                  </Select>
                </Form.Item>
              </div>
              
              <Divider orientation="left">Mentions spéciales</Divider>
              {
                this.tagslist.filter( n => n.isMention === true && n.isGold === false ).map( n => 
                <div key={n.id}>
                  <Form.Item name={`tags-${n.id}`} tooltip={n.description} valuePropName="checked">
                    <Checkbox onChange={this.onFilterChange.bind(this)} title={n.description} value={n.id}>{n.name}</Checkbox>
                  </Form.Item>
                </div>)
              }
              <Divider orientation="left">Tags</Divider>
              {
                this.tagslist.filter( n => n.isMention === false && n.isGold === false ).map( n => 
                
                  <Form.Item  key={n.id} name={`tags-${n.id}`} tooltip={n.description} valuePropName="checked">
                    <Checkbox onChange={this.onFilterChange.bind(this)} title={n.description} value={n.id}>{n.name}</Checkbox>
                  </Form.Item>
                )
              }
              <Divider orientation="left">Glands d'Or</Divider>
              <div>
                <Form.Item value="" name="gold">
                  <Select onChange={this.onFilterChange.bind(this)} mode="multiple">
                  {
                    this.tagslist.filter( n => n.isMention === false && n.isGold === true ).map( n => 
                      <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                      )
                  }
                  </Select>
                </Form.Item>
              </div>
            </Form>
          </Sider>




          <Content>
            <div>
                <div>{this.state.loading && <span><Spin/></span>}</div>
                {this.state.escapeList && this.state.escapeList.map( n => <EscapeCard key={n.id} escape={n} enseigne={n.enseigne}/>)}
            </div>
              {
                /**
                 <div>
                   <Pagination defaultCurrent={1} total={50} />
                 </div>
                 */
              }
          </Content>

        </Layout>
      </div>
    )
  }

}


export default withRouter(SearchC);