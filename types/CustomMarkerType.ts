import { EarthquakeData } from "./USGSDataType";

type MarkerDetails = {
  details: EarthquakeData;
  id: string;
  selected: boolean;
};

export default MarkerDetails;
