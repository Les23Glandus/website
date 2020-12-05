/**
 * Connector to strapi
 * to retreive information
 */

class strapiConnector {

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

            fetch(url).then( response => {
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
            fetch("/graphql",requestOptions).then( response => {
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
    builGQLdQuery(table) {
        let v = {limit:10, where:{}, start:0, sort:"id"};
        let q = `query($limit:Int, $where:JSON, $start:Int, $sort:String){
            `+table.replace(/:.+$/,"")+`(limit:$limit, where:$where, start:$start, sort:$sort) `+this.structure[table]+`
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
          mini {id url formats} 
          tags {id name isMention isVisible}  
          enseigne { id name uniquepath 
            address {pays {name} region {name} } 
          }
        }
      }`,


      "actus:list":`{
        id
        uniquepath
        illustration {id formats url}
        channel
        date
        description
        title
      }`,


      "actus":`{
        id
        uniquepath
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
          url
          isOpen
          address {id town postcode street name pays {id name} region {id name} }
          logo {id url formats}
          illustration {id formats url}
          uniquepath
          published_at
          escapes { id name uniquepath date }
        }`,    
  

      
        "escapes:list":`{
          id
          name
          rate
          date
          mini {
            id
            formats
            url
          }
          uniquepath
          rate
          tags {
            id
            name
            isVisible
            isMention
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
            address {pays {name} region {name} } 
          }
        }`,


  
      "escapes":`{
          id
          name
          rate
          date
          published_at
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
            isVisible
            isMention
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
            address {pays {name} region {name} } 
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



/*
# Exemple GraphQL
# Write your query or mutation here
{
  escapes(limit:2, sort: "published_at", start:0, where:{rate:4, name_contains:"casse"}) {
    id
    name
    rate
    published_at
  }
}
*/