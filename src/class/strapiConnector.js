/**
 * Connector to strapi
 * to retreive information
 */

class strapiConnector {

    //constructor() {
    //}

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

    getEscape(id) {
        return this.fetch('/escapes/' + id);
    }
    getEscapeByRef(ref) {
        return this.fetch('/escapes/' + ref);
    }
    getEnseigne(id) {
        return this.fetch('/companies/' + id);
    }
    getEnseigneByRef(ref) {
        return this.fetch('/companies/' + ref);
    }

}

export default strapiConnector;