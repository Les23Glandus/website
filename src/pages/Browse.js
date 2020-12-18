import { Divider, Form, Pagination, Select, Skeleton, Spin } from "antd";
import Checkbox from "antd/lib/checkbox/Checkbox";
import React from "react";
import { withRouter } from "react-router-dom";
import strapiConnector from "../class/strapiConnector";
import EscapeCard from "../components/EscapeCard";
import HtmlHead from "../components/HtmlHead";
import Page500 from "./Page500";
import TopIllustration from "../components/meta/TopIllustration";
import "../css/browse.scss";
import Card from "../components/meta/Card";
import {
  SearchOutlined
} from '@ant-design/icons';

  
class Browse extends React.Component {

  tagslist = null;
  payslist = null;
  regionlist = null;
  preventSearch = false;
  inCache = {};

  constructor(props) {
    super(props);
    this.state = {
      loaded:false
      , error:false
      , loadingCard:false
      , regionList:null
      , escapeList:null
      , presetList:[]
      , lineperpage: 5
      , currentpage: 0
    };

    this.paysRef = React.createRef();
    this.formRef = React.createRef();
    this.sortformRef = React.createRef();
    this.regionRef = React.createRef();

    this.searchTop = React.createRef();
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


  loadCards(list, cur, size) {
    let refs = list.slice(cur * size, cur * size + size)
      .map( n => n.uniquepath ).filter( n => typeof(this.inCache[n]) === "undefined" );
    
    if( refs && refs.length > 0 ) {
      
      this.setState({loadingCard:true});
      new strapiConnector().getEscapeByRef(refs,true).then( res => {
        if( res ) {
          if( typeof(res.forEach) !== "function" ) res = [res];
          res.forEach( n => this.inCache[ n.uniquepath ] = n );                       
        }

        this.setState({loadingCard:false});
      });
    }
  }

  onPaginationChange(cur,size) {
    this.setState({currentpage:cur-1, lineperpage:size});
    this.loadCards(this.state.escapeList, cur-1, size);
    this.executeScroll();
  }

  /**
   * 
   */
  onFilterChange() {
    if( this.preventSearch ) return;
    //Buidl query
    let query = {};
    let filter = this.formRef.current.getFieldsValue();
    console.info(JSON.stringify(filter));
    let sort = this.sortformRef.current.getFieldsValue();
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

    this.setState({loading:true, currentpage:0});
    new strapiConnector().browseEscapes( query, 1000, sort.sort )
    .then( d => {
      d = this.reduceListPerTags(d, query["tags.id"]);
      this.loadCards(d, this.state.currentpage, this.state.lineperpage);
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
    this.formRef.current.setFieldsValue({"addresses.region.id":[]});     
    this.setState({regionList:r});
    this.onFilterChange();
  }


  /**
   * 
   * @param {*} setup 
   */
  setFilterValue(setup) {
    this.preventSearch = true;
    this.formRef.current.resetFields();
    this.onPaysChange(setup["addresses.pay.id"]);
    this.formRef.current.setFieldsValue(setup);
    
    this.preventSearch = false;
    this.onFilterChange();
  }

  
  executeScroll() {
    if( this.searchTop.current )
       this.searchTop.current.scrollIntoView();  
  }
  /**
   * 
   */
  render() {
    if( this.state.error ) {
      return ( <Page500/> )
    }
    if( !this.state.loaded ) {
      return (
      <div className="browse-main">
          <TopIllustration/>
          <div className="browse-presets">
            <Skeleton active/>
          </div>
          <Divider/>
          <div className="browse">
            <div className="browse-filter">
            </div>
            <div className="browse-result">
              <Skeleton active avatar={true}/>
              <Skeleton active avatar={true}/>
              <Skeleton active avatar={true}/>
            </div>
          </div>
        </div>
      )
    }
    
    return (
      <div className="browse-main">
        
          <HtmlHead title={`Recherche`}/>
          {
            !this.state.presetList && 
            <div>
              <Skeleton active/>
            </div>  
          }
          <TopIllustration/>
          {
            this.state.presetList && this.state.presetList.presets &&
            <div className="browse-presets">
            {
               this.state.presetList.presets.map( n => {
                return <Card className="preset-card"
                          reduce={true}
                          url={"#"}
                          arrow={false}
                          key={n.id}
                          bigText={n.name}
                          compact
                          imageTitle={n.description}
                          imageUrl={n.illustration ? n.illustration.url : null}
                          onClick={(e)=>{this.setFilterValue( n.preset ); e.preventDefault(); this.executeScroll(); }}
                      ></Card>
                }
              )
            }
            <Card className="seemore-card"
                reduce={true}
                url={"/selections"}
                bigText={<span>Ou,<br/> parcourez nos sélections</span>}
                title={""}
                compact
                imageUrl={null}
                imageTitle={""}
                more={""}
                color={null}
            ></Card>
            <Card className="search-card"
                reduce={true}
                url={"/search"}
                bigText={<SearchOutlined />}
                title={""}
                compact
                imageUrl={null}
                imageTitle={""}
                more={""}
                color={null}
            ></Card>
            </div>  
          }







        <div className="browse-sort" ref={this.searchTop}>
          <h3>Trouvez votre prochaine escape</h3>
          <div className="sort-by">
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

        <div className="browse">
          <div className="browse-filter">

            <Form ref={this.formRef}>
                <Divider orientation="left"></Divider>
                <div>
                  <Form.Item label="Pays" name="addresses.pay.id">
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
                  <Form.Item label="Régions" name="addresses.region.id">
                    <Select onChange={this.onFilterChange.bind(this)} mode="multiple" placeholder="Régions" ref={this.regionRef} showArrow  showSearch={false}>
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
                      <Select.Option value={11}>10+</Select.Option>
                    </Select>
                  </Form.Item>
                </div>
                
                <Divider orientation="left"></Divider>
                <p className="top-sec">Mentions spéciales</p>
                {
                  this.tagslist.filter( n => n.isMention === true && n.isGold === false ).map( n => 
                  <div key={n.id}>
                    <Form.Item name={`tags-${n.id}`} tooltip={n.description} valuePropName="checked">
                      <Checkbox onChange={this.onFilterChange.bind(this)} title={n.description} value={n.id}>{n.name}</Checkbox>
                    </Form.Item>
                  </div>)
                }
                <Divider orientation="left"></Divider>
                <p className="top-sec">Tags</p>
                {
                  this.tagslist.filter( n => n.isMention === false && n.isGold === false ).map( n => 
                  
                    <Form.Item  key={n.id} name={`tags-${n.id}`} tooltip={n.description} valuePropName="checked">
                      <Checkbox onChange={this.onFilterChange.bind(this)} title={n.description} value={n.id}>{n.name}</Checkbox>
                    </Form.Item>
                  )
                }
                <Divider orientation="left"></Divider>
                <div>
                  <Form.Item value="" name="gold">
                    <Select onChange={this.onFilterChange.bind(this)} mode="multiple" placeholder="Glandus d'Or" showArrow showbrowse={false}>
                    {
                      this.tagslist.filter( n => n.isMention === false && n.isGold === true ).map( n => 
                        <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                        )
                    }
                    </Select>
                  </Form.Item>
                </div>
              </Form>

          </div>
          <div className="search-result">
              <div>
                  <div>{ this.state.loading && <p className="loading-spin"><Spin/></p>}</div>
                  { 
                    this.state.escapeList && 
                    this.state.escapeList
                          .slice(this.state.currentpage * this.state.lineperpage, this.state.currentpage * this.state.lineperpage + this.state.lineperpage)
                          .map( n => {
                            if( this.inCache[n.uniquepath] ) {
                              n = this.inCache[n.uniquepath];
                            }
                            return <EscapeCard key={n.id} escape={n} enseigne={n.enseigne}/>
                          })
                  
                  }
              </div>
              <div className="pagination">
                {
                  this.state.escapeList && 
                  <Pagination current={this.state.currentpage+1} total={this.state.escapeList.length} 
                    showSizeChanger
                    pageSizeOptions={[5,10,20,50]} 
                    defaultPageSize={this.state.lineperpage}
                    onChange={this.onPaginationChange.bind(this)}
                    onShowSizeChange={this.onPaginationChange.bind(this)}
                    showTotal={(t)=><span>{t} Escape{t>1 ? "s" : ""}</span>}
                  />
                }
              </div>
          </div>
        </div>
      </div>
    )
  }

}


export default withRouter(Browse);