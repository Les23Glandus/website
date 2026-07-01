import CarouselView from "./CarouselView";
import { getCarousel } from "../lib/strapi";
import "../styles/carousel.scss";

export default async function Carousel() {
  let slides = [];
  try {
    slides = (await getCarousel()) || [];
  } catch {
    slides = [];
  }
  return <CarouselView slides={slides} />;
}
