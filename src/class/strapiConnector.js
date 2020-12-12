/**
 * Connector to strapi
 * to retreive information
 */

class strapiConnector {

  API = process.env.NODE_ENV === "development" ? "" : "/api";

  /**
   * Selections
   */
  getChoixSelection() {
    return this.fetch("/choix-selection"); 
  }
  getSelections() {
    return this.fetch("/selections");
  }
  getSelectionByRef(ref) {
      let body = this.builGQLdQuery("selections");
      body.variables.where = {"uniquepath":ref};
      body.variables.limit = 1;
      return this.graphql(body);
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
    return this.fetch("/carousels");
  }
  
    

  /**
   * filter-presets 
   */
  getFilterPresets() {
    return this.fetch("/filter-presets");
  }

  /**
   * Escapes 
   */
  getEscape(id) {
      return this.fetch("/escapes/"+id);
  }
  getRecentEscapes(limit) {
    let body = this.builGQLdQuery("escapes:list");
    body.variables.where = {"preventPush":false};
    body.variables.limit = limit;
    body.variables.sort = "date:DESC";
    return this.graphql(body);
  }
  getEscapeByRef(ref) {
      let body = this.builGQLdQuery("escapes");
      body.variables.where = {"uniquepath":ref};
      body.variables.limit = 1;
      return this.graphql(body);
  }
  getEscapeBetweenDate(dmin, dmax) {
    let body = this.builGQLdQuery("escapes:list");
    body.variables.where = {"date_gt":dmin, "date_lt":dmax, "preventPush":false};
    body.variables.sort = "date:DESC";
    body.variables.limit = 100;
    return this.graphql(body);
  }
  searchEscapes(query, limit, start, sortby) {
    let body = this.builGQLdQuery("escapes:list",true);
    body.variables.where = query;
    body.variables.limit = limit ? limit : 100;
    body.variables.start = start ? start : 0;
    body.variables.sort = sortby ? sortby : "date:DESC";
    return this.graphql(body);
  }
  getRealisation() {
    return this.fetch("/escapes/sum");
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

  /**
   * Enseigne 
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
    return this.graphql(body);
  }


    /**
     * GET to URL
     * @param url 
     */
    fetch(url) {
        return new Promise((resolve, reject) => {

            fetch(this.API + url).then( response => {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(message)
            };
            fetch(this.API + "/graphql",requestOptions).then( response => {
                if(response.ok) {
                    response.json().then( r => {
                        if( !r.data ) reject(null);
                        else {
                            let d = Object.entries(r.data);
                            if( d.length <= 0 ) reject(null);
                            if( message.variables.limit === 1 ) resolve( d[0][1][0] );
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
        let v = {limit:10, where:{}, start:0, sort:"id"};
        let count = includeCount ? table.replace(/:.+$/,"")+"Count(where:$where)" : "";
        let q = `query($limit:Int, $where:JSON, $start:Int, $sort:String){
            ${table.replace(/:.+$/,"")}(limit:$limit, where:$where, start:$start, sort:$sort) ${this.structure[table]}
            ${count}
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
        description
        escapes {
          id name uniquepath rate isOpen date
          nbPlayerMin
          nbPlayerMax
          mini {id url formats} 
          tags {id name isMention isGold description}  
          enseigne { id name uniquepath 
            addresses {pay {name} region {name} } 
          }
        }
      }`,

      
      "pays:list":`{
        id name regions {id name}
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
            description
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
  

      
        "escapes:list":`{
          id
          name
          rate
          date
          description
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
            picto {
              id
              name
              url
              formats
            }
            useInFilter
          }
          preventPush
          isOpen
          nbPlayerMin
          nbPlayerMax
          enseigne { id name uniquepath 
            addresses {pay {name} region {name} } 
            escapes { id name uniquepath date nbPlayerMin nbPlayerMax tags {id name isGold} }
          }    
          selections {id title description uniquepath mini {id url formats}}
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