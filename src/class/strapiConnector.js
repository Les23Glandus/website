/**
 * Connector to strapi
 * to retreive information
 */

class strapiConnector {

    //constructor() {
    //}
    structure = {
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
        escapes { id name uniquepath }
      }`,    
    "escapes":`{
        id
        name
        rate
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
        enseigne {id uniquepath name}
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




    

    getEscape(id) {
        return this.fetch("/escapes/"+id);
    }
    getAllEscape() {
        return this.fetch("/escapes");
    }
    getEscapeByRef(ref) {
        let body = this.builGQLdQuery("escapes");
        body.variables.where = {"uniquepath":ref};
        body.variables.limit = 1;
        return this.graphql(body);
    }

    
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
                            console.log(message.variables.limit);
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
            `+table+`(limit:$limit, where:$where, start:$start, sort:$sort) `+this.structure[table]+`
          }`;

        return {query:q, variables:v};
    }

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