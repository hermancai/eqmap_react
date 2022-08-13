import { FC, useState, useEffect, useCallback, useRef } from "react";
import { USGSReturnedObject } from "../models/USGSDataType";
import { Marker, GoogleMap } from "@react-google-maps/api";
import useLoadWindowWithGoogle from "../hooks/useLoadWindowWithGoogle";

type MarkerDetails = {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  icon?: string | google.maps.Icon | google.maps.Symbol | undefined;
  time: number;
  onMouseOver: Function;
  onMouseOut: Function;
};

const Results: FC<{ data: USGSReturnedObject | null }> = ({ data }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const { isLoaded } = useLoadWindowWithGoogle();

  const [markerList, setMarkerList] = useState<MarkerDetails[]>([]);
  const [bounds, setBounds] = useState<google.maps.LatLngBounds | null>(null);

  const buildMarkerList = useCallback(
    (data: USGSReturnedObject): MarkerDetails[] => {
      const newBounds = new google.maps.LatLngBounds(data.center);
      const newMarkerList = data.features.map((entry): MarkerDetails => {
        const position = {
          lat: entry.geometry.coordinates[1],
          lng: entry.geometry.coordinates[0],
        };

        const redIcon: google.maps.Symbol = {
          path: google.maps.SymbolPath.CIRCLE,
          scale: entry.properties.mag * 5,
          fillColor: "red",
          fillOpacity: 0.25,
          strokeColor: "white",
          strokeWeight: 0.5,
        };

        const infoWindow = new google.maps.InfoWindow({
          content: `<p>${entry.properties.place}<br>Magnitude: ${
            entry.properties.mag
          }<br>${new Date(entry.properties.time).toLocaleString()}</p>`,
          position: position,
          pixelOffset: new google.maps.Size(0, entry.properties.mag * -5),
        });

        newBounds.extend(position);

        return {
          position: position,
          icon: redIcon,
          time: entry.properties.time,
          onMouseOver: () => {
            infoWindow.open({ map: map });
          },
          onMouseOut: () => infoWindow.close(),
        };
      });
      newMarkerList.push({
        position: data.center,
        time: new Date().getTime(),
        onMouseOut: () => null,
        onMouseOver: () => null,
      });
      setBounds(newBounds);
      return newMarkerList;
    },
    [map]
  );

  const onMapLoad = useCallback(
    (map: google.maps.Map): void => {
      if (data === null || bounds === null) return;
      map.fitBounds(bounds);
      setMap(map);
    },
    [data, bounds]
  );

  const onMapUnmount = useCallback((): void => {
    setMarkerList([]);
    setMap(null);
  }, []);

  useEffect((): void => {
    if (data === null || !isLoaded) return;
    setMarkerList(buildMarkerList(data));
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, buildMarkerList, isLoaded]);

  if (data === null || !isLoaded) return <></>;
  return (
    <div
      ref={sectionRef}
      className="w-[90%] mt-6 flex flex-col justify-center items-center bg-white rounded-md p-6 border-[1px] border-slate-300 gap-6"
    >
      <p className="underline decoration-orange-400 decoration-2 text-lg">
        {data.features.length === 1
          ? "1 earthquake found."
          : data.features.length + " earthquakes found."}
      </p>
      <GoogleMap
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        mapContainerStyle={{
          width: "100%",
          height: "500px",
        }}
        center={data.center}
        zoom={8}
      >
        {markerList.map((entry) => (
          <Marker
            onMouseOver={() => entry.onMouseOver()}
            onMouseOut={() => entry.onMouseOut()}
            position={entry.position}
            icon={entry.icon}
            key={entry.time}
          ></Marker>
        ))}
      </GoogleMap>
    </div>
  );
};

export default Results;
