"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "antd";
import { SearchOutlined, HomeFilled } from "@ant-design/icons";
import { trackEvent } from "../lib/analytics";

/** Easter egg "Ne pas cliquer" — portée depuis components/Header.js (CRA). */
const EFFECTS = [
  { filter: "", transform: "rotate(180deg)" },
  { filter: "blur(2px) grayscale(1)", transform: "" },
  { filter: "", transform: "rotate(90deg) scaleX(-1)" },
  { filter: "blur(2px)", transform: "" },
  { filter: "grayscale(1)", transform: "scaleX(0.5)" },
  { filter: "blur(8px)", transform: "" },
  { filter: "grayscale(1)", transform: "" },
  { filter: "", transform: "scaleX(-1)" },
  { filter: "", transform: "" },
];

export default function Header() {
  const pathname = usePathname();
  const rootRef = useRef(null);
  const cur = useRef(-1);
  const [, forceRender] = useState(0);

  const selected = [];
  if (pathname?.indexOf("/escapegame") === 0) selected.push("1");
  if (pathname?.indexOf("/jeux") === 0) selected.push("2");
  if (pathname?.indexOf("/news") === 0) selected.push("3");
  if (pathname?.indexOf("/about") === 0) selected.push("4");

  function doNotClick() {
    cur.current = (cur.current + 1) % EFFECTS.length;
    const effect = EFFECTS[cur.current];
    // Anciennement document.getElementById('root') (structure CRA) : on cible
    // ici le conteneur applicatif via un ref (voir app/layout.js).
    const root = document.getElementById("app-root");
    if (root) {
      root.style.transform = effect.transform;
      root.style.filter = effect.filter;
    }
    trackEvent("NePasCliquer", "Click", "Click sur ne pas cliquer");
    forceRender((n) => n + 1);
  }

  const items = [
    { key: "1", label: <Link href="/"><HomeFilled /></Link> },
    { key: "2", label: <Link href="/escapegame">Expériences Immersives</Link> },
    { key: "3", label: <Link href="/jeux">Jeux de société</Link> },
    { key: "4", label: <Link href="/news">Actualité</Link> },
    { key: "5", label: <Link href="/about">A Propos</Link> },
    { key: "6", label: "Ne pas cliquer", onClick: doNotClick },
    { key: "7", label: <Link href="/search"><SearchOutlined /></Link> },
  ];

  return (
    <div className="main-header" ref={rootRef}>
      <div>
        <h1>
          <Link href="/" style={{ background: "url(/Glandus-300px.png) 0 0 no-repeat" }}>
            Les Glandus
          </Link>
        </h1>
      </div>
      <Menu theme="dark" mode="horizontal" selectedKeys={selected} items={items} />
    </div>
  );
}
