"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { RightOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";
import "../../styles/meta_card.scss";

/**
 * T205 — composant client (utilise scroll/resize du navigateur). Le pattern
 * de secours est choisi au premier rendu client (évite Math.random() pendant
 * le SSR, qui provoquerait un mismatch d'hydratation).
 * Bug corrigé au passage : l'ancien composant ajoutait un listener 'scroll'
 * sans jamais le retirer (fuite mémoire) — cf. plan.md T205.
 */
export default function Card({
  className = "",
  url = "",
  imageUrl = "",
  imageTitle = "",
  title = "",
  subTitle = "",
  supTitle = "",
  reduce = true,
  compact = false,
  color = null,
  bigText = false,
  arrow = true,
  onClick = null,
  preview = false,
  children,
  more,
}) {
  const picRef = useRef(null);
  const [defaultPic, setDefaultPic] = useState("/patterns/Pattern01.svg");

  useEffect(() => {
    const rd = Math.floor(Math.random() * 12) + 1;
    setDefaultPic(`/patterns/Pattern${rd < 10 ? "0" : ""}${rd}.svg`);
  }, []);

  useEffect(() => {
    function updateBGY() {
      if (!picRef.current) return;
      const pos = picRef.current.getBoundingClientRect();
      const before = pos.top + pos.height;
      const after = window.innerHeight - pos.top;
      const marge = 5;
      let newposY;
      if (before <= 0) newposY = marge;
      else if (after <= 0) newposY = 100 - marge;
      else newposY = 50 - Math.round(((50 - marge) * (after - before)) / Math.max(Math.abs(after), Math.abs(before)));
      picRef.current.style.backgroundPositionY = newposY + "%";
    }
    updateBGY();
    window.addEventListener("scroll", updateBGY);
    return () => window.removeEventListener("scroll", updateBGY);
  }, []);

  const reduceClassName = reduce ? "reduce" : "full";
  const compactClass = compact ? reduceClassName + " compact" : reduceClassName;
  const classname = ["meta-card", compactClass];
  if (className) classname.push(className);
  const pcolor = {};
  if (color) {
    classname.push("colored");
    pcolor.backgroundColor = color;
  }

  const finalImageUrl = imageUrl || defaultPic;
  const isAnchor = !url || url.indexOf("#") === 0;

  return (
    <div className={classname.join(" ")}>
      <div
        className={`meta-card-mini ${reduceClassName}`}
        ref={picRef}
        style={{ backgroundImage: `url(${finalImageUrl})` }}
      />

      {isAnchor && (
        <a href={url} onClick={onClick} className={`meta-card-minilink ${reduceClassName}`} style={pcolor} title={imageTitle}>
          {bigText && (
            <p>
              <span>{bigText}</span>
              {arrow && <span className="chevron"><RightOutlined /></span>}
            </p>
          )}
        </a>
      )}
      {!isAnchor && (
        <Link href={url} onClick={onClick} className={`meta-card-minilink ${reduceClassName}`} style={pcolor} title={imageTitle}>
          {bigText && (
            <p>
              <span>{bigText}</span>
              {arrow && <span className="chevron"><RightOutlined /></span>}
            </p>
          )}
        </Link>
      )}

      <Link href={url || "#"} onClick={onClick} className={`meta-card-details ${reduceClassName}`}>
        <div className="noflexpart">
          {!reduce && <p className="sup-title">{supTitle}</p>}
          {preview && <Skeleton title active paragraph={false} />}
          {!preview && <p className="title">{title}</p>}
        </div>
        <div className="flexpart">
          <div className="flexpart-left">
            <p className="sub-title">{subTitle}</p>
            {!reduce && children}
          </div>
          {!reduce && (
            <div className="flexpart-2">
              {!reduce && more}
              {!reduce && preview && <Skeleton active />}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
