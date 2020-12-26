import React from "react";
import { withRouter } from "react-router-dom";
import "../../css/meta_share.scss";
import { FacebookOutlined, InstagramOutlined, MailOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Helmet } from "react-helmet";
  
class Note extends React.Component {

  jsonld = 
  {
      "@context":"http://schema.org",
      "@type":"Organization",
      "name":"Les Glandus",
      "alternateName":"LesGlandus.fr",
      "url":"https://www.lesglandus.fr/",
      "sameAs":[
          "https://lesglandus.fr/",
          "https://www.facebook.com/lesglandus/",
          "https://www.instagram.com/les_glandus/",
          "https://www.youtube.com/channel/UCHroxKGnXQsRAvr9W6SsV4Q"
      ]
  };

  render() {    
    return (
      <div className="share-link">
        <Helmet>
            <script  type="application/ld+json" id="social-json-ld">{JSON.stringify(this.jsonld)}</script>
        </Helmet>
        <p className="title">Faisons connaissance</p>
        <ul>
          <li className="fa-glandus"><a href="https://www.facebook.com/lesglandus/" target="_blank" rel="noreferrer"><FacebookOutlined /></a></li>
          <li className="fa-insta"><a href="https://www.instagram.com/les_glandus/" target="_blank" rel="noreferrer"><InstagramOutlined /></a></li>
          <li className="fa-mail"><a href="mailto:les23glandus@gmail.com" target="_blank" rel="noreferrer"><MailOutlined /></a></li>
          <li className="fa-youtube"><a href="https://www.youtube.com/channel/UCHroxKGnXQsRAvr9W6SsV4Q" target="_blank" rel="noreferrer"><YoutubeOutlined /></a></li>
        </ul>
      </div>
    )
  }

}


export default withRouter(Note);