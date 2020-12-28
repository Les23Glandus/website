/**
 * Connector to strapi
 * to retreive information
 */
import md5 from 'md5';

class strapiConnector {

  API = process.env.NODE_ENV === "development" ? "" : "/api";

  /**
   * Selections
   */
  getChoixSelection() {
    let body = this.builGQLdSingle("choixSelection");
    return this.graphql(body);
  }
  getSelections() {
    let body = this.builGQLdQuery("selections:list");
    body.variables.limit = 300;
    return this.graphql(body);
  }
  getSelectionByRef(ref) {
      let body = this.builGQLdQuery("selections");
      body.variables.where = {"uniquepath":ref};
      body.variables.limit = 1;
      return this.graphql(body);
  }
  searchSelection(query, limit) {
    let body = this.builGQLdQuery("selections:list");
    body.variables.where = {"title_contains":query};
    body.variables.limit = limit;
    body.variables.sort = "title:ASC";
    body.variables.cache = 0; 
    return this.graphql(body);
  }


  /**
   * A Propos
   */
  getAPropos() {
    return this.fetch("/a-propos","12"); 
  }
  getHomeAPropos() {
    let body = this.builGQLdSingle("aPropo");
    body.variables.limit = 1;
    return this.graphql(body);
  }
  getGlanduses() {
    return this.fetch("/glanduses","12"); 
  }
  

  /**
   * Tags
   */
  getTags() {
    let body = this.builGQLdQuery("tags:list");
    body.variables.where = {"useInFilter":true};
    body.variables.limit = 1000;
    return this.graphql(body);
  }

  /**
   * Pays
   */
  getPays() {
    let body = this.builGQLdQuery("pays:list");
    body.variables.limit = 1000;
    return this.graphql(body);
  }


  /**
   * Carousel
   */
  getCarousel() {    
    let body = this.builGQLdQuery("carousels");
    body.variables.limit = 10;
    body.variables.sort = "date:ASC";
    return this.graphql(body);
  }
  
    

  /**
   * filter-presets 
   */
  getFilterPresets() {
    return this.fetch("/filter-presets","1");
  }

  /**
   * Escapes 
   */
  getEscape(id) {
      return this.fetch("/escapes/"+id+"","1");
  }
  getRecentEscapes(limit) {
    let body = this.builGQLdQuery("escapes:list");
    body.variables.where = {"preventPush":false,"isOpen":true};
    body.variables.limit = limit;
    body.variables.sort = "date:DESC";
    body.variables.cache = 1; 
    return this.graphql(body);
  }
  getEscapeByRef(ref, min) {
      let body = this.builGQLdQuery("escapes" + (min ? ":list" : "") );
      body.variables.where = {"uniquepath":ref};
      body.variables.limit = typeof(ref.map) === "function" ? ref.length : 1;
      body.variables.cache = body.variables.limit === 1 ? 4 : 0;
      return this.graphql(body);
  }
  getEscapeBetweenDate(dmin, dmax) {
    let body = this.builGQLdQuery("escapes:list");
    body.variables.where = {"date_gt":dmin, "date_lt":dmax, "preventPush":false, "isOpen":true};
    body.variables.sort = "date:DESC";
    body.variables.limit = 100;
    body.variables.cache = 0; 
    return this.graphql(body);
  }
  browseEscapes(query, limit, sortby, nocache) {
    let body = this.builGQLdQuery("escapes:id");
    body.variables.where = query;
    body.variables.limit = limit ? limit : 100;
    body.variables.sort = sortby ? sortby : "date:DESC"; 
    body.variables.cache = nocache ? 0 : 4;
    return this.graphql(body);
  }
  getRealisation() {
    return this.fetch("/escapes/sum","1");
  }
  searchEscapes(query, limit) {
    let body = this.builGQLdQuery("escapes:list");
    body.variables.where = {"name_contains":query};
    body.variables.limit = limit;
    body.variables.sort = "date:DESC";
    body.variables.cache = 0; 
    return this.graphql(body);
  }

  /**
   * Enseigne 
   */
  getEnseigne(id) {
      return this.fetch("/companies/"+id);
  }
  getEnseigneByRef(ref) {
      let body = this.builGQLdQuery("companies");
      body.variables.where = {"uniquepath":ref};
      body.variables.limit = 1;
      return this.graphql(body);
  }
  searchEnseigne(query, limit) {
    let body = this.builGQLdQuery("companies:list");
    body.variables.where = {"name_contains":query};
    body.variables.limit = limit;
    body.variables.sort = "name:ASC";
    body.variables.cache = 0; 
    return this.graphql(body);
  }

  /**
   * Actu 
   */
  getActuByRef(ref) {
    let body = this.builGQLdQuery("actus");
    body.variables.where = {"uniquepath":ref};
    body.variables.limit = 1;
    return this.graphql(body);
  }
  getRecentActus(limit) {
    let body = this.builGQLdQuery("actus:list");
    body.variables.where = {};
    body.variables.limit = limit;
    body.variables.sort = "date:DESC";
    body.variables.cache = 2; 
    return this.graphql(body);
  }
  searchActus(query, limit) {
    let body = this.builGQLdQuery("actus:list");
    body.variables.where = {"title_contains":query};
    body.variables.limit = limit;
    body.variables.sort = "date:DESC";
    body.variables.cache = 0; 
    return this.graphql(body);
  }

  /**
   * Jeux 
   */
  getJeux(limit) {
    if(!limit) limit = 100;
    let body = this.builGQLdQuery("jeuxes:list");
    body.variables.limit = limit;
    body.variables.sort = "published_at:DESC";
    return this.graphql(body);
  }
  getJeuxByRef(ref) {
    let body = this.builGQLdQuery("jeuxes");
    body.variables.where = {"uniquepath":ref};
    body.variables.limit = 1;
    return this.graphql(body);
  }
  getRecentJeux(limit) {
    let body = this.builGQLdQuery("jeuxes:list");
    body.variables.limit = limit;
    body.variables.sort = "date:DESC";
    body.variables.cache = 1; 
    return this.graphql(body);
  }
  searchJeux(query, limit) {
    let body = this.builGQLdQuery("jeuxes:list");
    body.variables.where = {"name_contains":query};
    body.variables.limit = limit;
    body.variables.sort = "name:ASC";
    body.variables.cache = 0; 
    return this.graphql(body);
  }


  /**
   * GET to URL
   * @param url 
   */
  fetch(url, cache) {
      return new Promise((resolve, reject) => {
        
          const requestOptions = {
              method: 'GET',
              headers: { "my-cache":cache ? cache : 0 },
          };

          fetch(this.API + url, requestOptions).then( response => {
              if(response.ok) {
                  response.json().then( r => resolve(r) );
              } else {
                  reject(response.error);
              }
            })
            .catch(function(error) {
              reject(error);
            });
      }); 
    }

    /**
     * Post message to graphql endpoint
     * @param message 
     */
    graphql(message) {
        
        return new Promise((resolve, reject) => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' ,
                            "my-cache":message.variables.cache ,
                              "my-cache-query": md5( JSON.stringify(message.variables) )  },
                body: JSON.stringify(message)
            };
            fetch(this.API + "/graphql",requestOptions).then( response => {
                if(response.ok) {
                    response.json().then( r => {
                        if( !r.data ) reject(null);
                        else {
                            let d = Object.entries(r.data);
                            if( d.length <= 0 ) reject(null);
                            if( message.variables.limit === 1 ) {
                              if( typeof( d[0][1].filter ) === "function" ) resolve( d[0][1][0] );
                              else resolve( d[0][1] );
                            }
                            else resolve( d[0][1] );
                        }
                    } );
                } else {
                    reject(response.error);
                }
              })
              .catch(function(error) {
                reject(error);
              });
        }); 
    }

    /**
     * Prepare query for graphql
     * @param  table 
     */
    builGQLdQuery(table, includeCount) {
      let v = {limit:10, where:{}, start:0, sort:"id", t:table, cache:4};//cache ~ cacheValue * 20min
      let count = includeCount ? table.replace(/:.+$/,"")+"Count(where:$where)" : "";
      let q = `query($limit:Int, $where:JSON, $start:Int, $sort:String){
          ${table.replace(/:.+$/,"")}(limit:$limit, where:$where, start:$start, sort:$sort) ${this.structure[table]}
          ${count}
        }`;

      return {query:q, variables:v};
    }
    builGQLdSingle(table) {
        let v = {limit:10, where:{}, start:0, sort:"id", cache:12};
        let q = `query{
            ${table.replace(/:.+$/,"")} ${this.structure[table]}
          }`;

        return {query:q, variables:v};
    }



    structure = {
      "selections":`{
        id
        title
        article
        mini {id url formats}
        image {id url formats} 
        color colorpicker
        description
        escapes {
          id name uniquepath rate isOpen date
          nbPlayerMin
          description
          scenario
          nbPlayerMax
          mini {id url formats} 
          tags {id name isMention isGold description}  
          enseigne { id name uniquepath 
            addresses {pay {name} region {name} } 
          }
        }
      }`,

      "selections:list":`{
        id
        title
        uniquepath
        mini {id url formats}
        color colorpicker
        description
      }`,


      "choixSelection":`{
        id Selections {
          selection {
            id
            title
            uniquepath
            mini {id url formats}
            color colorpicker
            description
          }
        }
      }`,


      "carousels":`{
        id title link image {id url formats} date description published_at 
      }`,
      
      "pays:list":`{
        id name regions {id name}
      }`,


      "aPropo":`{
        title
        article
        illustrations { id formats url }
      }`,

      
      "tags:list":`{
        id
        name
        description
        isGold
        isMention
        useInFilter
      }`,


      "actus:list":`{
        id
        uniquepath
        mini {id formats url}
        channel
        date
        description
        title
      }`,


      "actus":`{
        id
        uniquepath
        mini {id formats url}
        illustration {id formats url}
        channel
        date
        published_at
        description
        title
        article
      }`,
  
  
      "companies":`{
        id
        name
        introduction
        ourExperience
        published_at
        updated_at
        url
        isOpen
        addresses {id town postcode street name pay {id name} region {id name} }
        logo {id url formats}
        illustration {id formats url}
        uniquepath
        published_at
        escapes { id name uniquepath date nbPlayerMin nbPlayerMax 
          scenario
          description
          rate
          mini { id formats url}
          tags {
            id
            name
            isMention
            isGold 
            description
            useInFilter
          } }
      }`,    


      
  
      "companies:list":`{
        id
        name
        isOpen
        logo {id url formats}
        uniquepath
      }`,    
  


      "jeuxes": `{ id name uniquepath date article description editeur 
        illustration {id formats url}
        jeux_types { name }
        mini {id formats url}
      }`,




      "jeuxes:list": `{ id name uniquepath date description 
        jeux_types { name }
        published_at
        mini {id formats url}
      }`,


      
        "escapes:id":`{
          id
          uniquepath
          tags {
            id
          }
        }`,

      

        "escapes:list":`{
          id
          name
          rate
          date
          description
          scenario
          mini {
            id
            formats
            url
          }
          uniquepath
          addresses {id town postcode street name pay {id name} region {id name} }
          rate
          tags {
            id
            name
            isMention
            isGold 
            description
            useInFilter
          }
          preventPush
          isOpen
          nbPlayerMin
          nbPlayerMax
          enseigne { id name uniquepath 
            addresses {pay {name} region {name} } 
          }
        }`,


  
      "escapes":`{
          id
          name
          rate
          glandusor
          date
          published_at
          updated_at
          mini {
            id
            formats
            url
          }
          illustration {
            id
            formats
            url
          }
          scenario
          description
          uniquepath
          story
          audio {
            id
            url
          }
          lesPlus
          lesMoins
          rate
          tags {
            id
            name
            isMention
            isGold description
            useInFilter
          }
          preventPush
          isOpen
          nbPlayerMin
          nbPlayerMax
          addresses {pay {name} region {name}  town } 
          enseigne { id name uniquepath 
            addresses {pay {name} region {name} town } 
            escapes { id name uniquepath date nbPlayerMin nbPlayerMax tags {id name isGold} }
          }    
          selections {id title description uniquepath color mini {id url formats}}
          avantapres {
            id
            when
            image {
              name
              caption
              url
              formats
            }
          }
        }`
                          };
  
  
  

}

export default strapiConnector;