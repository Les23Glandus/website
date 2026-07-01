import Card from "./meta/Card";
import { mediaUrl } from "../lib/media";

const MAP_COLOR = {
  Black: "#00000082",
  Gold: "#C08A0082",
  Red: "#C0000082",
  Orange: "#C05C0082",
  Green: "#00C03682",
  Aqua: "#00C09E82",
  Cyan: "#0092C082",
  Blue: "#0013C082",
  Purple: "#5500C082",
  Pink: "#BC00C082",
};

export default function SelectionCard({ details, reduce, compact, arrow }) {
  let imageUrl;
  if (details.mini) {
    imageUrl = mediaUrl(details.mini.formats?.small ? details.mini.formats.small.url : details.mini.url);
  }

  let color;
  if (details.color && MAP_COLOR[details.color]) {
    color = MAP_COLOR[details.color];
  } else if (details.colorpicker) {
    color = details.colorpicker + "82";
  }

  return (
    <Card
      className="selection-card"
      reduce={!!reduce}
      compact={!!compact}
      url={`/selections/${details.uniquepath}`}
      bigText={details.title}
      imageUrl={imageUrl}
      imageTitle={details.description}
      color={color}
      arrow={arrow === false ? false : true}
    />
  );
}
