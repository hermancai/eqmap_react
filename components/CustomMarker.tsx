import React from "react";
import { Marker } from "@react-google-maps/api";
import { EarthquakeData } from "../types/USGSDataType";

const CustomMarker: React.FC<{
  entry: EarthquakeData;
  map: google.maps.Map | null;
  toggleSelect: Function;
  isSelected: boolean;
}> = ({ entry, map, toggleSelect, isSelected }) => {
  const icon: google.maps.Symbol = {
    path: google.maps.SymbolPath.CIRCLE,
    scale: entry.properties.mag * 5,
    fillColor: isSelected ? "green" : "red",
    fillOpacity: 0.25,
    strokeColor: "white",
    strokeWeight: 0.5,
  };

  const infoWindow = React.useMemo(() => {
    return new google.maps.InfoWindow({
      content: `<p>${entry.properties.place}<br>Magnitude: ${
        entry.properties.mag
      }<br>${new Date(entry.properties.time).toLocaleString()}</p>`,
      position: {
        lat: entry.geometry.coordinates[1],
        lng: entry.geometry.coordinates[0],
      },
      pixelOffset: new google.maps.Size(0, entry.properties.mag * -5),
    });
  }, [entry]);

  if (map === null) return <></>;

  return (
    <Marker
      position={{
        lat: entry.geometry.coordinates[1],
        lng: entry.geometry.coordinates[0],
      }}
      icon={icon}
      onMouseOver={() => infoWindow.open({ map: map })}
      onMouseOut={() => infoWindow.close()}
      onClick={() => toggleSelect(entry.id)}
    />
  );
};

export default CustomMarker;
