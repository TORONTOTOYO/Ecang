import { Children } from "react";
import Carousel from "./Carousel.jsx";
import { useContent } from "../content/ContentContext.jsx";

// Shows cards in a centered row. When there are more cards than
// settings.carouselAfter (set in the admin panel), it turns into a carousel.
export default function CardList({ label, children }) {
  const { settings } = useContent();
  if (Children.count(children) > settings.carouselAfter) {
    return <Carousel label={label}>{children}</Carousel>;
  }
  return <div className="card-row">{children}</div>;
}
