import { Children } from "react";
import Carousel from "./Carousel.jsx";
import { settings } from "../data.js";

// Shows cards in a centered row. When there are more cards than
// settings.carouselAfter (see data.js), it turns into a carousel.
export default function CardList({ label, children }) {
  if (Children.count(children) > settings.carouselAfter) {
    return <Carousel label={label}>{children}</Carousel>;
  }
  return <div className="card-row">{children}</div>;
}
