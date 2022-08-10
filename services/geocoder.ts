type ResponseError = {
  code: string;
  endpoint: string;
  message: string;
  name: string;
  stack: string;
};

const getCoordinates = async (
  geocoder: google.maps.Geocoder,
  address: string
): Promise<{ res?: google.maps.GeocoderResponse; error?: string }> => {
  try {
    const response = await geocoder.geocode({ address: address });
    return { res: response };
  } catch (e: any) {
    // Error should be structured like ResponseError. Given by google.
    if (e.code) {
      return { error: e.code };
    }
    return { error: "Searching for location failed." };
  }
};

export { getCoordinates };
