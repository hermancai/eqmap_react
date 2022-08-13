type EarthquakeData = {
  geometry: {
    coordinates: number[];
  };
  properties: {
    mag: number;
    place: string;
    time: number;
    title: string;
  };
};

type USGSReturnedObject = {
  bbox?: number[];
  features: EarthquakeData[];
  metadata: {};
  center: google.maps.LatLng;
};

export { type USGSReturnedObject, type EarthquakeData };
