import { FC, useState, useEffect, useCallback, useRef } from "react";
import { USGSReturnedObject } from "../types/USGSDataType";
import { Marker, GoogleMap } from "@react-google-maps/api";
import MarkerDetails from "../types/CustomMarkerType";
import CustomMarker from "./CustomMarker";
import ResultsTable from "./ResultsTable";

const Results: FC<{ data: USGSReturnedObject | null }> = ({ data }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markerList, setMarkerList] = useState<MarkerDetails[]>([]);

  // This derived state handles adding/removing center marker from map.
  const [center, setCenter] = useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    if (data === null || map === null) {
      setMarkerList([]);
      setCenter(null);
      return;
    }

    setCenter(data.center);
    const bounds = new google.maps.LatLngBounds(data.center);
    const newMarkerList = data.features.map((entry): MarkerDetails => {
      bounds.extend({
        lat: entry.geometry.coordinates[1],
        lng: entry.geometry.coordinates[0],
      });

      return {
        details: entry,
        id: entry.id,
        selected: false,
      };
    });

    setMarkerList(newMarkerList);
    if (newMarkerList.length > 1) map.fitBounds(bounds);

    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, map]);

  const onMapLoad = useCallback((map: google.maps.Map): void => {
    setMap(map);
  }, []);

  const onMapUnmount = useCallback((): void => {
    setMarkerList([]);
    setMap(null);
  }, []);

  const toggleSelect = (id: string): void => {
    setMarkerList((prevState) => {
      return prevState.map((entry) => {
        return id === entry.id
          ? { ...entry, selected: !entry.selected }
          : entry;
      });
    });
  };

  if (data === null) return <></>;

  return (
    <div
      ref={sectionRef}
      className="w-[90%] mt-6 flex flex-col justify-center items-center bg-white rounded-md p-6 border-[1px] border-slate-300 gap-6"
    >
      <GoogleMap
        onLoad={onMapLoad}
        onUnmount={onMapUnmount}
        mapContainerStyle={{
          width: "100%",
          height: "500px",
        }}
        center={data.center}
        zoom={9}
      >
        {center === null ? null : <Marker position={center}></Marker>}
        {markerList.map((entry) => (
          <CustomMarker
            entry={entry}
            map={map}
            key={entry.id}
            toggleSelect={toggleSelect}
          />
        ))}
      </GoogleMap>
      <p className="underline decoration-orange-400 decoration-2 text-lg">
        {data.features.length === 1
          ? "1 earthquake found."
          : data.features.length + " earthquakes found."}
      </p>
      <ResultsTable entries={markerList} toggleSelect={toggleSelect} />
    </div>
  );
};

export default Results;
