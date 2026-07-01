import "@ant-design/v5-patch-for-react-19";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme } from "antd";
import { GoogleAnalytics } from "@next/third-parties/google";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollToTop from "../components/ScrollToTop";
import JsonLd from "../components/meta/JsonLd";
import { organizationJsonLd } from "../lib/jsonld";
import config from "../lib/config";
import "antd/dist/reset.css";
import "../styles/common.scss";

// T109 — remplace public/index.html + src/App.js + src/index.js.
export const metadata = {
  metadataBase: new URL(config.origin),
  title: "Les Glandus - Blog Escape Game et Expériences immersives",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/Glandus-192px.png", sizes: "192x192", type: "image/png" },
      { url: "/Glandus-64px.png", sizes: "64x64", type: "image/png" },
      { url: "/Glandus-16px.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/Glandus-300px.png",
  },
  other: {
    "theme-color": "#000000",
  },
};

export const viewport = {
  width: 768,
  maximumScale: 5.0,
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr"><head>
      <link 
          async 
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body>
        <AntdRegistry>
          <ConfigProvider
            direction="ltr"
            theme={{
              algorithm: theme.darkAlgorithm,
              components: {
                Tag: {
                  defaultBg: '#fff',
                },
                Divider: {
                  colorSplit: 'rgb(67, 67, 67)',
                },
                Select: {
                  colorTextQuaternary: '#ffffffd9',
                  colorIcon: '#ffffffd9',
                  colorIconHover: '#fff',
                  optionSelectedColor: '#171717',
                  optionSelectedBg: '#ffffffd9',
                  colorBorder: 'rgb(67, 67, 67)',
                },
              },
              // Tokens explicites en plus de l'algorithme, pour retomber sur les
              // mêmes couleurs que l'ancien thème (styles/_theme.scss) sur les
              // composants pilotés par le token système (Input, Select, Form...),
              // au lieu de dépendre uniquement du calcul par défaut de darkAlgorithm.
              token: {
                borderRadius: "2px",
                colorBgContainer: "#171717", // $default-darkcolor
                colorBgElevated: "#2c2c2c", // $zoning-background
                colorBgLayout: "#171717", // $primary-background-color
                colorText: "#ffffffd9", // $link-color
                colorBorder: "#8c8d8c", // $default-darklightcolor
                fontFamily: '"Montserrat",sans-serif',
                colorPrimary: "#333",
              },
            }}
          >
            <ScrollToTop />
            <div id="app-root">
              <JsonLd data={organizationJsonLd()} />
              <div><Header /></div>
              <div>{children}</div>
              <div><Footer /></div>
            </div>
          </ConfigProvider>
        </AntdRegistry>
        {config.ga4Id && <GoogleAnalytics gaId={config.ga4Id} />}
      </body>
    </html>
  );
}
