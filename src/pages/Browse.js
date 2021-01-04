import { Button, Divider, Form, Pagination, Select, Skeleton, Spin } from "antd";
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
import SelectionsGrid from "../components/SelectionsGrid";
import {
  SearchOutlined
} from '@ant-design/icons';
import OtherEnseigne from "../components/OtherEnseigne";
import Slice from "../components/meta/Slice";

  
class Browse extends React.Component {

  static ID_FRANCE = "1";
  static ID_IDF = "1";

  tagslist = null;
  payslist = null;
  regionlist = null;
  preventSearch = false;
  displayEnglish = false;
  inCache = {};

  firstLoad = true;

  constructor(props) {
    super(props);
    this.state = {
      loaded:false
      , error:false
      , loadingCard:false
      , regionList:null
      , displayLang:false
      , displayDep:false
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

  reset() {
    this.setFilterValue({});
    this.onPaysChange(false);
    this.onRegionChange(false);
    this.executeScroll();
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
    let tagsOR = [];
    let filter;
    
    if( this.firstLoad ) {
      this.firstLoad = false;
      if( window.sessionStorage["browseFilter"] ) {
        filter = JSON.parse( window.sessionStorage["browseFilter"] );
        if( filter ) this.setFilterValue( filter );
      }
    }
    if(!filter) filter = this.formRef.current.getFieldsValue();
    if( filter["addresses.region.id"] && filter["addresses.region.id"].length === 0 ) delete( filter["addresses.region.id"] );
    console.info(JSON.stringify(filter));
    if(!this.firstLoad) window.sessionStorage["browseFilter"] = JSON.stringify(filter);
    let sort = this.sortformRef.current.getFieldsValue();
    let reg = /^tags-(\d+)$/;
    Object.keys( filter ).forEach((k) => {
      if( filter[k] !== undefined && filter[k] !== false ) {
        let mtch = reg.exec(k);
        if( mtch ) {
          let tagId = mtch[1];
          if( !query["tags.id"] ) query["tags.id"] = [];
          query["tags.id"].push( tagId );
        } else if( k === "addresses.pay.id" && filter[k] === "row" ) {
          query["addresses.pay.id_ne"] = Browse.ID_FRANCE;
        } else if( k === "gold" || k === "english" ) {
          if( !query["tags.id"] ) query["tags.id"] = [];
          query["tags.id"] = query["tags.id"].concat( filter[k] );
          tagsOR = tagsOR.concat( filter[k] );
        } else if( k === "nbplayer" ) {
          query["nbPlayerMin_lte"] = filter[k];
          query["nbPlayerMax_gte"] = filter[k];
        } else {
          query[k] = filter[k];
        }
      }
    });
    if( query["tags.id"] && query["tags.id"].length <= 0 ) delete(query["tags.id"]);

    this.setState({loading:true, currentpage:0});
    new strapiConnector().browseEscapes( query, 1000, sort.sort )
    .then( d => {
      let tagsAND = query["tags.id"] ? query["tags.id"].filter( n => tagsOR.indexOf(n) < 0 ) : null;
      d = this.reduceListPerTags(d, tagsAND, tagsOR);
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
  reduceListPerTags(list, tagsAnd, tagsOr) {
    if( !tagsAnd || (tagsAnd.length <= 1 && !tagsOr) ) return list;
    if(!tagsOr) tagsOr = [];

    return list.map( n => {
          if(!n["ta"]) n["ta"] = 0;
          if(!n["to"]) n["to"] = tagsOr.length > 0 ? false : true;
          n.tags.forEach( t => {
            if( tagsAnd.indexOf(t.id) >= 0 ) n["ta"]++;
            if( tagsOr.indexOf(t.id) >= 0 ) n["to"] = true;
          });
          return n;
        }).filter( n => n["ta"] === tagsAnd.length && n["to"] );
  }
  
  
  /**
   * 
   * @param {*} selectedPaysId 
   */
  onPaysChange(selectedPaysId) {
    if(!selectedPaysId) selectedPaysId = false;
    let p = this.payslist.find( n => n.id === selectedPaysId );
    let r = null;
    if( p ) r = p.regions;
    let displayLang = selectedPaysId !== "1" && selectedPaysId !== false;
    this.formRef.current.setFieldsValue({"addresses.region.id":[]});
    if(!displayLang) this.formRef.current.setFieldsValue({"english":[]});
     
    this.setState({
      regionList:r, 
      displayLang:displayLang
    });
    this.onFilterChange();
  }

  onRegionChange(selected) {
    if( selected && selected.length === 1 && selected[0] === Browse.ID_IDF ) {
      this.setState({displayDep:true});
    } else {
      this.setState({displayDep:false});    
      this.formRef.current.setFieldsValue({"addresses.postcode_contains":false});    
    }
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
    this.onRegionChange(setup["addresses.region.id"]);
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
          <Slice>
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
          </Slice>
        </div>
      )
    }
    
    return (
      <div className="browse-main">
        
          <HtmlHead title={`Toutes les escapes testées`}/>
          {
            !this.state.presetList && 
            <div>
              <Skeleton active/>
            </div>  
          }
          <TopIllustration/>
          <Slice breath>

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
                <Card className="search-card"
                    reduce={true}
                    url={"/search"}
                    bigText={<SearchOutlined />}
                    title={""}
                    compact
                    arrow={false}
                    imageUrl={null}
                    imageTitle={""}
                    more={""}
                    color={null}
                ></Card>
                </div>  
              }
          </Slice>
          <Slice breath>


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
                            this.payslist.filter(n => n.id === Browse.ID_FRANCE ).map( n => 
                              <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                              )
                          }
                          <Select.Option value="row">Reste du monde</Select.Option>
                          <Select.OptGroup label="-----">
                            {
                              this.payslist.filter(n => n.id !== Browse.ID_FRANCE ).sort((a,b) => a.name.localeCompare( b.name ) ).map( n => 
                                <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                                )
                            }
                          </Select.OptGroup>
                        </Select>
                      </Form.Item>
                    </div>

                    <div style={{display:(this.state.regionList === null || this.state.regionList.length <= 0 ? "none" : "block")}}>
                      <Form.Item label="Régions" name="addresses.region.id">
                        <Select onChange={this.onRegionChange.bind(this)} mode="multiple" placeholder="Régions" ref={this.regionRef} showArrow  showSearch={false}>
                          {
                            this.state.regionList !== null && this.state.regionList.map( n => 
                              <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                              )
                          }
                        </Select>
                      </Form.Item>
                    </div>
                    {
                      this.state.displayDep &&
                      <div>
                        <Form.Item label="Département" name="addresses.postcode_contains">
                          <Select onChange={this.onFilterChange.bind(this)}>
                            <Select.Option value={false}> </Select.Option>
                            <Select.Option value={75}>75 - <span className='smo'>Paris</span></Select.Option>
                            <Select.Option value={92}>92 - <span className='smo'>Hauts-de-Seine</span></Select.Option>
                            <Select.Option value={93}>93 - <span className='smo'>Seine-Saint-Denis</span></Select.Option>
                            <Select.Option value={94}>94 - <span className='smo'>Val-de-Marne</span></Select.Option>
                            <Select.Option value={95}>95 - <span className='smo'>Val-d'Oise</span></Select.Option>
                            <Select.Option value={91}>91 - <span className='smo'>Essone</span></Select.Option>
                            <Select.Option value={78}>78 - <span className='smo'>Yvelines</span></Select.Option>
                            <Select.Option value={77}>77 - <span className='smo'>Seine-et-Marne</span></Select.Option>
                          </Select>
                        </Form.Item>
                      </div>
                    }

                    {
                      this.state.displayLang &&
                      <div>
                        <Divider orientation="left"></Divider>
                        <p className="top-sec">Anglais requis:</p>
                        <div className="chkbx-tags">
                        
                        <Form.Item label="" name="english">
                          <Select onChange={this.onFilterChange.bind(this)} mode="multiple" placeholder="Anglais requis" showArrow  showSearch={false}>
                            {
                              this.tagslist.filter( n => n.english === true ).map( n => 
                                <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                                )
                            }
                          </Select>
                        </Form.Item>
                        </div>
                      </div>
                    }
                    
                    <Divider orientation="left"></Divider>
                    <div>
                      <Form.Item label="Nombre de joueurs" name="nbplayer">
                        <Select onChange={this.onFilterChange.bind(this)}>
                          <Select.Option value={false}> </Select.Option>
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
                    <div className="chkbx-tags">
                    {
                      this.tagslist.filter( n => n.isMention === true && n.isGold === false && !n.english ).map( n => 
                      <div key={n.id}>
                        <Form.Item name={`tags-${n.id}`} tooltip={n.description} valuePropName="checked">
                          <Checkbox onChange={this.onFilterChange.bind(this)} title={n.description} value={n.id}>{n.name}</Checkbox>
                        </Form.Item>
                      </div>)
                    }
                    </div>
                    <Divider orientation="left"></Divider>
                    <p className="top-sec">Tags</p>
                    <div className="chkbx-tags">
                    {
                      this.tagslist.filter( n => n.isMention === false && n.isGold === false && !n.english ).map( n => 
                      
                        <Form.Item  key={n.id} name={`tags-${n.id}`} tooltip={n.description} valuePropName="checked">
                          <Checkbox onChange={this.onFilterChange.bind(this)} title={n.description} value={n.id}>{n.name}</Checkbox>
                        </Form.Item>
                      )
                    }
                    </div>
                    <Divider orientation="left"></Divider>
                    <div>
                      <Form.Item value="" name="gold">
                        <Select onChange={this.onFilterChange.bind(this)} mode="multiple" placeholder="Glandus d'Or" showArrow showbrowse={false}>
                        {
                          this.tagslist.filter( n => n.isMention === false && n.isGold === true && !n.english ).map( n => 
                            <Select.Option value={n.id} key={n.id}>{n.name}</Select.Option>
                            )
                        }
                        </Select>
                      </Form.Item>
                    </div>

                    <div>
                      <Divider></Divider>
                      <Button onClick={this.reset.bind(this)}>Reset</Button>
                    </div>
                  </Form>

              </div>
              <div className="browse-result">
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
          </Slice>


          <Slice colored breath>
            <SelectionsGrid onError={()=>this.setState({error:true})}/>
          </Slice>
          
          <Slice breath>
            <OtherEnseigne/>
          </Slice>
        

      </div>
    )
  }

}


export default withRouter(Browse);