import React from "react";
import PropTypes from "prop-types";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormSchema from "../models/FormSchema";
import { FormType, defaultFormValues } from "../models/FormType";
import { PencilIcon } from "@heroicons/react/outline";
import ErrorMessage from "./ErrorMessage";
import { USGSReturnedObject } from "../models/USGSDataType";
import { getCoordinates } from "../services/geocoder";
import { useJsApiLoader } from "@react-google-maps/api";
import getUSGSdata from "../services/USGSapi";

const Form: React.FC<{
  setData: React.Dispatch<React.SetStateAction<USGSReturnedObject | null>>;
}> = ({ setData }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
  });

  const geocoder: google.maps.Geocoder | null = React.useMemo(() => {
    // window may not be defined because Nextjs attempts SSR
    if (typeof window !== "undefined" && isLoaded)
      return new window.google.maps.Geocoder();
    return null;
  }, [isLoaded]);

  const onSubmit: SubmitHandler<FormType> = async (data) => {
    setData(null);
    setisLoading(true);
    setSearchError("");

    // Geocoder should not be null after google script and page is loaded
    const geocoderResponse = await getCoordinates(
      geocoder!,
      getValues("location")
    );

    if (geocoderResponse.error || !geocoderResponse.res) {
      setisLoading(false);
      return setSearchError(
        geocoderResponse.error || "Failed to geocode the location"
      );
    }

    const USGSResponse = await getUSGSdata(getValues(), geocoderResponse.res);
    if (USGSResponse.error || !USGSResponse.response) {
      setisLoading(false);
      return setSearchError(
        USGSResponse.error || "Failed to get data from USGS"
      );
    }

    setisLoading(false);
    setData(USGSResponse.response);
  };

  const {
    register,
    watch,
    getValues,
    trigger,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormType>({
    resolver: yupResolver(FormSchema),
  });

  const [isLoading, setisLoading] = React.useState<boolean>(false);
  const [searchError, setSearchError] = React.useState<string>("");

  const watchStartDateCheck = watch("startDateCheck", false);
  const watchEndDateCheck = watch("endDateCheck", false);
  React.useEffect(() => {
    if (watchStartDateCheck || watchEndDateCheck) {
      trigger("startDate");
      trigger("endDate");
    }
  }, [trigger, watchStartDateCheck, watchEndDateCheck]);

  return (
    <>
      <div className="flex flex-col justify-center items-center py-6 bg-white rounded-md p-6 border-[1px] border-slate-300">
        <p className="text-center">
          Search for earthquake data by filling the form and clicking Search
          below.
        </p>
        <button
          onClick={() => reset(defaultFormValues)}
          className="flex flex-row flex-nowrap items-center border-2 border-slate-800"
        >
          <PencilIcon className="h-4" />
          Auto-fill
        </button>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full space-y-6"
        >
          <div className="formSection">
            <label className="formLabel">Location</label>
            <input
              className="formInput"
              placeholder="The area to search for quakes"
              {...register("location", { required: true })}
            />
            {errors.location ? (
              <ErrorMessage message={errors.location.message} />
            ) : null}
          </div>

          <div className="formSection">
            <div className="flex flex-row justify-between items-baseline gap-3">
              <label className="formLabel">Start Date</label>
              <span className="h-[.1px] grow bg-orange-300" />
              <div className="flex flex-row flex-nowrap gap-1 items-center hover:cursor-pointer">
                <input
                  type="checkbox"
                  id="startDateCheck"
                  className="accent-slate-800 hover:cursor-pointer h-4 w-4"
                  {...register("startDateCheck")}
                />
                <label
                  htmlFor="startDateCheck"
                  className="hover:cursor-pointer"
                >
                  30 Days Before
                </label>
              </div>
            </div>
            <input
              type="date"
              placeholder="Starting date of quake events"
              className="formInput disabled:opacity-50"
              {...register("startDate")}
              disabled={watchStartDateCheck}
            />
            {errors.startDate ? (
              <ErrorMessage message={errors.startDate.message} />
            ) : null}
          </div>

          <div className="formSection">
            <div className="flex flex-row justify-between items-baseline gap-3">
              <label className="formLabel">End Date</label>
              <span className="h-[.1px] grow bg-orange-300" />
              <div className="flex flex-row flex-nowrap gap-1 items-center hover:cursor-pointer">
                <input
                  type="checkbox"
                  id="endDateCheck"
                  className="accent-slate-800 hover:cursor-pointer h-4 w-4"
                  {...register("endDateCheck")}
                />
                <label htmlFor="endDateCheck" className="hover:cursor-pointer">
                  Now
                </label>
              </div>
            </div>
            <input
              type="date"
              placeholder="Ending date of quake events"
              className="formInput disabled:opacity-50"
              {...register("endDate")}
              disabled={watchEndDateCheck}
            />
            {errors.endDate ? (
              <ErrorMessage message={errors.endDate.message} />
            ) : null}
          </div>

          <div className="formSection">
            <label className="formLabel">Magnitude (0 - 10)</label>
            <div className="flex flex-row items-center gap-3">
              <input
                type="text"
                placeholder="Min (0)"
                className="formInput text-center"
                {...register("minMag", { required: true, min: 0, max: 10 })}
              />
              <p> - </p>
              <input
                type="text"
                placeholder="Max (10)"
                className="formInput text-center"
                {...register("maxMag", { required: true, min: 0, max: 10 })}
              />
            </div>
            {errors.minMag || errors.maxMag ? (
              <ErrorMessage message="Create a magnitude range from 0 to 10." />
            ) : null}
          </div>

          <div className="formSection">
            <label className="formLabel">Search Radius (km)</label>
            <input
              type="text"
              placeholder="Radius in kilometers of the search area"
              className="formInput"
              {...register("searchRadius", { required: true })}
            />
            {errors.searchRadius ? (
              <ErrorMessage message={errors.searchRadius.message} />
            ) : null}
          </div>

          <div className="formSection">
            <label className="formLabel">Result Limit</label>
            <input
              type="text"
              placeholder="Limit of quake events to be found"
              className="formInput"
              {...register("resultLimit", { required: true })}
            />
            {errors.resultLimit ? (
              <ErrorMessage message={errors.resultLimit.message} />
            ) : null}
          </div>

          <button
            className="bg-slate-800 text-white w-min rounded-md p-3"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="border-2 border-t-transparent border-orange-400 animate-spin h-4 w-4 rounded-full" />
            ) : (
              "Search"
            )}
          </button>
          {searchError === "" ? null : <p>Error: {searchError}</p>}
        </form>
      </div>
    </>
  );
};

Form.propTypes = {
  setData: PropTypes.func.isRequired,
};

export default Form;
