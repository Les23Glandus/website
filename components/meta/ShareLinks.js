import { FacebookOutlined, InstagramOutlined, MailOutlined, YoutubeOutlined } from "@ant-design/icons";
import "../../styles/meta_share.scss";

/**
 * T202 — le JSON-LD "Organization" (auparavant injecté via react-helmet dans
 * un composant qui pouvait apparaître sur n'importe quelle page via Footer)
 * est maintenant rendu une seule fois, côté serveur, dans app/layout.js.
 * Ce composant ne rend donc plus que les liens sociaux.
 */
export default function ShareLinks() {
  return (
    <div className="share-link">
      <p className="title">Faisons connaissance</p>
      <ul>
        <li className="fa-glandus"><a href="https://www.facebook.com/lesglandus/" target="_blank" rel="noreferrer"><FacebookOutlined /></a></li>
        <li className="fa-insta"><a href="https://www.instagram.com/les_glandus/" target="_blank" rel="noreferrer"><InstagramOutlined /></a></li>
        <li className="fa-mail"><a href="mailto:les23glandus@gmail.com" target="_blank" rel="noreferrer"><MailOutlined /></a></li>
        <li className="fa-youtube"><a href="https://www.youtube.com/channel/UCHroxKGnXQsRAvr9W6SsV4Q" target="_blank" rel="noreferrer"><YoutubeOutlined /></a></li>
      </ul>
    </div>
  );
}
