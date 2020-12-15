import React from "react";
import { Link, withRouter } from "react-router-dom";
import gfm from "remark-gfm";
import ReactMarkdown from 'react-markdown'
import { Image } from "antd";
  
class RichText extends React.Component {

    
    render() {

    const renderers = {
        image: (value) => { 
            const cl = ["r1","r1","r2","r0","rm1","rm1","rm2"];
            return <div className="rt-img-handler" alt={value.alt}><Image src={value.src} alt={value.alt} className={cl[ ~~(Math.random() * cl.length) ]}/></div>},
        link: (value) => { 
            const reg = /^\//;
            if( reg.test(value.href) ) {
                return <Link to={value.href}>{value.children}</Link> 
            } else {
                return <a href={value.href} className="outlink" target="_blank" rel="noreferrer">{value.children}</a> 
            }
        }
            
    };
        
    return (
        <div className="full-text">
            <ReactMarkdown 
                plugins={[gfm]}
                renderers={renderers}
                allowedTypes={ReactMarkdown.types}>{this.props.children}</ReactMarkdown>
            <p style={{clear:"both"}}/>
        </div>
    )
  }

}


export default withRouter(RichText);