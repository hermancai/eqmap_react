import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const useLoadWindowWithGoogle = (): { isLoaded: boolean } => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
  });

  if (typeof window !== "undefined" && isLoaded) {
    return { isLoaded: true };
  }
  return { isLoaded: false };
};

export default useLoadWindowWithGoogle;
