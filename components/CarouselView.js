"use client";

import { Carousel as AntCarousel } from "antd";
import { isMobile } from "react-device-detect";
import TopIllustration from "./meta/TopIllustration";
import { mediaUrl } from "../lib/media";

export default function CarouselView({ slides }) {
  return (
    <div className="home-carousel">
      <AntCarousel autoplay>
        {slides && slides.length > 0
          ? slides.map((n) => {
              let imgUrl = mediaUrl(n.image.url);
              if (isMobile && n.image.formats && n.image.formats.medium) {
                imgUrl = mediaUrl(n.image.formats.medium.url);
              }
              const contentStyle = { backgroundImage: `url(${imgUrl})` };
              const textBlock = (
                <div className="text">
                  <div><span>{n.title}</span></div>
                </div>
              );
              return (
                <div key={n.id} title={n.description} className="carousel">
                  {n.link ? <a href={n.link}>{textBlock}</a> : textBlock}
                  <div className="illustration" style={contentStyle} />
                </div>
              );
            })
          : (
            <div><TopIllustration seed="carousel" /></div>
          )}
      </AntCarousel>
    </div>
  );
}
