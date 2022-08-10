import { FC } from "react";
import { USGSReturnedObject } from "../models/USGSDataType";

const Results: FC<{ data: USGSReturnedObject | null }> = ({ data }) => {
  if (data === null) return <></>;

  if (data.features.length === 0) return <p>No quakes were found.</p>;

  // In list of coordinates, longitude in [0] and latitude in [1]
  return <p>lat: {data.features[0].geometry.coordinates[1]}</p>;
};

export default Results;
