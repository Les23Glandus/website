import React from "react";
import { Link, withRouter } from "react-router-dom";
import gfm from "remark-gfm";
import ReactMarkdown from 'react-markdown'
import { Image } from "antd";
  
class RichText extends React.Component {

    
    render() {

    const renderers = {
        image: (value) => { 
            let rg = /\.mp4$/;
            if( rg.test( value.src ) ) {
                return (<video controls>
                            <source src={value.src} type="video/mp4"/>
                            Votre navigateur ne supporte pas les vidéos
                        </video>)
            } else {

                const cl = ["r1","r1","r2","r0","rm1","rm1","rm2"];
                return <div className="rt-img-handler" alt={value.alt}><Image src={value.src} alt={value.alt} className={cl[ ~~(Math.random() * cl.length) ]}/></div>
            }
        },
        link: (value) => { 
            let href = value.href;
            if( href ) href = href.replace(/^https?:\/\/(lesglandus.fr|www\.lesglandus.fr|dev\.lesglandus.fr|15.188.205.192)/i, "");
            const reg = /^\//;
            if( reg.test(href) ) {
                return <Link to={href}>{value.children}</Link> 
            } else {
                return <a href={href} className="outlink" target="_blank" rel="noreferrer">{value.children}</a> 
            }
        }
            
    };
        
    return (
        <div className="full-text">
            <ReactMarkdown 
                plugins={[gfm]}
                renderers={renderers}
                allowedTypes={ReactMarkdown.types}>{this.props.children}</ReactMarkdown>
                
        </div>
    )
  }

}


export default withRouter(RichText);