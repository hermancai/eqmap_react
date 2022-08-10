import { FormType } from "../models/FormType";
import { USGSReturnedObject } from "../models/USGSDataType";

const buildURL = (formValues: FormType, lat: number, lng: number): string => {
  let base =
    "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&orderby=magnitude";
  if (!formValues.startDateCheck) {
    base = base.concat("&starttime=" + formValues.startDate);
  }
  if (!formValues.endDateCheck) {
    base = base.concat("&endtime=" + formValues.endDate);
  }
  base = base.concat(
    `&latitude=${lat}&longitude=${lng}&maxradiuskm=${formValues.searchRadius}&minmagnitude=${formValues.minMag}&maxmagnitude=${formValues.maxMag}&limit=${formValues.resultLimit}`
  );

  return base;
};

const getUSGSdata = async (
  formValues: FormType,
  res: google.maps.GeocoderResponse
): Promise<{ response?: USGSReturnedObject; error?: string }> => {
  const url = buildURL(
    formValues,
    res.results[0].geometry.location.lat(),
    res.results[0].geometry.location.lng()
  );

  try {
    const response = await fetch(url);
    return { response: await response.json() };
  } catch (e) {
    return { error: "Failed to get data from USGS" };
  }
};

export default getUSGSdata;
