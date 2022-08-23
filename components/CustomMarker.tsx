import React from "react";
import { Marker } from "@react-google-maps/api";
import MarkerDetails from "../models/CustomMarkerType";

const CustomMarker: React.FC<{
  entry: MarkerDetails;
  map: google.maps.Map | null;
  toggleSelect: Function;
}> = ({ entry, map, toggleSelect }) => {
  const icon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: entry.details.properties.mag * 5,
    fillColor: entry.selected ? "green" : "red",
    fillOpacity: 0.25,
    strokeColor: "white",
    strokeWeight: 0.5,
  };

  const position = React.useMemo(() => {
    return {
      lat: entry.details.geometry.coordinates[1],
      lng: entry.details.geometry.coordinates[0],
    };
  }, [entry]);

  const infoWindow = React.useMemo(() => {
    return new google.maps.InfoWindow({
      content: `<p>${entry.details.properties.place}<br>Magnitude: ${
        entry.details.properties.mag
      }<br>${new Date(entry.details.properties.time).toLocaleString()}</p>`,
      position: position,
      pixelOffset: new google.maps.Size(0, entry.details.properties.mag * -5),
    });
  }, [entry, position]);

  if (map === null) return <></>;

  return (
    <Marker
      position={position}
      icon={icon}
      onMouseOver={() => infoWindow.open({ map: map })}
      onMouseOut={() => infoWindow.close()}
      onClick={() => {
        // InfoWindow duplicates on click and ignores mouseover/out events.
        infoWindow.close();
        toggleSelect(entry.id);
      }}
    />
  );
};

export default CustomMarker;
