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
  const lat = res.results[0].geometry.location.lat();
  const lng = res.results[0].geometry.location.lng();
  const url = buildURL(formValues, lat, lng);

  try {
    const response = await fetch(url);
    const responseJSON: USGSReturnedObject = await response.json();
    return {
      response: {
        ...responseJSON,
        center: new google.maps.LatLng({ lat: lat, lng: lng }),
      },
    };
  } catch (e) {
    return { error: "Failed to get data from USGS" };
  }
};

export default getUSGSdata;
