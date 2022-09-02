import { FC, useState, useEffect, useCallback, useRef } from "react";
import { USGSReturnedObject, EarthquakeData } from "../types/USGSDataType";
import { Marker, GoogleMap } from "@react-google-maps/api";
import CustomMarker from "./CustomMarker";
import ResultsTable from "./ResultsTable";

type SelectedRow = {
  [key: string]: boolean;
};

const Results: FC<{ data: USGSReturnedObject | null }> = ({ data }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedRows, setSelectedRows] = useState<SelectedRow>({});

  // Derived states from data prop. Map markers don't work without it.
  const [markerList, setMarkerList] = useState<EarthquakeData[]>([]);
  const [center, setCenter] = useState<google.maps.LatLng | null>(null);

  useEffect(() => {
    if (data === null || map === null) {
      setMarkerList([]);
      setSelectedRows({});
      setCenter(null);
      return;
    }

    setCenter(data.center);
    const bounds = new google.maps.LatLngBounds(data.center);
    const newSelectedRows: SelectedRow = {};
    const newMarkerList = data.features.map((entry): EarthquakeData => {
      bounds.extend({
        lat: entry.geometry.coordinates[1],
        lng: entry.geometry.coordinates[0],
      });

      newSelectedRows[entry.id] = false;

      return entry;
    });

    setMarkerList(newMarkerList);
    setSelectedRows(newSelectedRows);
    if (data.features.length > 1) map.fitBounds(bounds);

    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [data, map]);

  const onMapLoad = useCallback((map: google.maps.Map): void => {
    setMap(map);
  }, []);

  const onMapUnmount = useCallback((): void => {
    setMarkerList([]);
    setSelectedRows({});
    setMap(null);
  }, []);

  const toggleSelect = (id: string): void => {
    setSelectedRows((prevState) => {
      return { ...prevState, [id]: !prevState[id] };
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
            isSelected={selectedRows[entry.id]}
          />
        ))}
      </GoogleMap>
      <p className="text-center underline decoration-orange-400 decoration-4 text-3xl">
        {data.features.length === 1
          ? "1 earthquake found."
          : data.features.length + " earthquakes found."}
      </p>
      {data.features.length > 0 ? (
        <ResultsTable
          entries={markerList}
          toggleSelect={toggleSelect}
          selectedRows={selectedRows}
        />
      ) : null}
    </div>
  );
};

export default Results;
