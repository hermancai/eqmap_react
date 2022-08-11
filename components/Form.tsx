import React from "react";
import PropTypes from "prop-types";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormSchema from "../models/FormSchema";
import { FormType, defaultFormValues } from "../models/FormType";
import { PencilIcon } from "@heroicons/react/outline";
import ErrorMessage from "./ErrorMessage";
import { Transition } from "@headlessui/react";
import { USGSReturnedObject } from "../models/USGSDataType";
import { getCoordinates } from "../services/geocoder";
import { useJsApiLoader } from "@react-google-maps/api";
import getUSGSdata from "../services/USGSapi";

const AnimatedInput: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="relative">
      {children}
      <span className="animateUnderline" />
    </div>
  );
};

const LongLoadNotification: React.FC<{
  isLoading: boolean;
  showLongLoad: boolean;
}> = ({ isLoading, showLongLoad }) => {
  if (!isLoading) return <></>;
  return (
    <Transition
      show={showLongLoad}
      enter="transition-[opacity,transform] duration-1000"
      enterFrom="opacity-0 -translate-y-full"
      enterTo="opacity-100 translate-y-0"
      leave="transition-[opacity,transform] duration-500"
      leaveFrom="opacity-100 translate-y-0"
      leaveTo="opacity-0 -translate-y-full"
    >
      <div className="self-center w-full text-center text-sm ">
        <p>Getting data from USGS...</p>
        <p>Depending on your search, this may take some time.</p>
      </div>
    </Transition>
  );
};

const Form: React.FC<{
  setData: React.Dispatch<React.SetStateAction<USGSReturnedObject | null>>;
}> = ({ setData }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API!,
  });

  const [isLoading, setisLoading] = React.useState<boolean>(false);
  const [showLongLoad, setShowLongLoad] = React.useState<boolean>(false);
  const [searchError, setSearchError] = React.useState<string>("");

  const geocoder: google.maps.Geocoder | null = React.useMemo(() => {
    // window may not be defined because Nextjs attempts SSR
    if (typeof window !== "undefined" && isLoaded)
      return new window.google.maps.Geocoder();
    return null;
  }, [isLoaded]);

  const onSubmit: SubmitHandler<FormType> = async () => {
    setData(null);
    setSearchError("");
    setisLoading(true);
    setShowLongLoad(false);
    setTimeout(() => {
      setShowLongLoad(true);
    }, 3000);

    // Geocoder should not be null after google script and page is loaded
    const geocoderResponse = await getCoordinates(
      geocoder!,
      getValues("location")
    );

    if (geocoderResponse.error || !geocoderResponse.res) {
      setisLoading(false);
      setShowLongLoad(false);
      return setSearchError(
        geocoderResponse.error || "Failed to geocode the location"
      );
    }

    const USGSResponse = await getUSGSdata(getValues(), geocoderResponse.res);
    if (USGSResponse.error || !USGSResponse.response) {
      setisLoading(false);
      setShowLongLoad(false);
      return setSearchError(
        USGSResponse.error || "Failed to get data from USGS"
      );
    }

    setisLoading(false);
    setShowLongLoad(false);
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
        <p className="text-center font-medium text-lg">
          Search for earthquake data by filling the form and clicking Search
          below.
        </p>

        <button
          className="relative animateButton my-3 flex flex-row flex-nowrap items-center gap-2 px-3 py-2 text-white rounded-md bg-slate-700"
          onClick={() => reset(defaultFormValues)}
        >
          <span className="animateBorder topSpan"></span>
          <PencilIcon className="h-4" />
          Autofill
          <span className="animateBorder bottomSpan"></span>
        </button>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-full space-y-6"
        >
          <div className="formSection">
            <label className="formLabel">Location</label>
            <AnimatedInput>
              <input
                className="formInput"
                placeholder="The area to search for quakes"
                {...register("location", { required: true })}
              />
            </AnimatedInput>
            {errors.location ? (
              <ErrorMessage message={errors.location.message} />
            ) : null}
          </div>

          <div className="formSection">
            <div className="flex flex-row justify-between items-baseline gap-3">
              <label className="formLabel">Start Date</label>
              <span className="h-0 grow border-t-[1px] border-orange-300" />
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
            <AnimatedInput>
              <input
                type="date"
                placeholder="Starting date of quake events"
                className="formInput disabled:opacity-50"
                {...register("startDate")}
                disabled={watchStartDateCheck}
              />
            </AnimatedInput>
            {errors.startDate ? (
              <ErrorMessage message={errors.startDate.message} />
            ) : null}
          </div>

          <div className="formSection">
            <div className="flex flex-row justify-between items-baseline gap-3">
              <label className="formLabel">End Date</label>
              <span className="h-0 grow border-t-[1px] border-orange-300" />
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
            <AnimatedInput>
              <input
                type="date"
                placeholder="Ending date of quake events"
                className="formInput disabled:opacity-50"
                {...register("endDate")}
                disabled={watchEndDateCheck}
              />
            </AnimatedInput>
            {errors.endDate ? (
              <ErrorMessage message={errors.endDate.message} />
            ) : null}
          </div>

          <div className="formSection">
            <label className="formLabel">Magnitude (0 - 10)</label>
            <div className="flex flex-row items-center gap-3">
              <AnimatedInput>
                <input
                  type="text"
                  placeholder="Min (0)"
                  className="formInput text-center"
                  {...register("minMag", { required: true, min: 0, max: 10 })}
                />
              </AnimatedInput>
              <p> - </p>
              <AnimatedInput>
                <input
                  type="text"
                  placeholder="Max (10)"
                  className="formInput text-center"
                  {...register("maxMag", { required: true, min: 0, max: 10 })}
                />
              </AnimatedInput>
            </div>
            {errors.minMag || errors.maxMag ? (
              <ErrorMessage message="Create a magnitude range from 0 to 10." />
            ) : null}
          </div>

          <div className="formSection">
            <label className="formLabel">Search Radius (km)</label>
            <AnimatedInput>
              <input
                type="text"
                placeholder="Radius in kilometers of the search area"
                className="formInput"
                {...register("searchRadius", { required: true })}
              />
            </AnimatedInput>
            {errors.searchRadius ? (
              <ErrorMessage message={errors.searchRadius.message} />
            ) : null}
          </div>

          <div className="formSection">
            <label className="formLabel">Result Limit</label>
            <AnimatedInput>
              <input
                type="text"
                placeholder="Limit of quake events to be found"
                className="formInput"
                {...register("resultLimit", { required: true })}
              />
            </AnimatedInput>
            {errors.resultLimit ? (
              <ErrorMessage message={errors.resultLimit.message} />
            ) : null}
          </div>

          <button
            className="relative animateButton h-10 w-36 self-center flex flex-col justify-center bg-slate-700 px-6 py-2 rounded-md text-white"
            disabled={isLoading}
            type="submit"
          >
            <span className="animateBorder topSpan"></span>
            {isLoading ? (
              <div className="border-2 border-t-transparent border-orange-400 animate-spin h-4 w-4 rounded-full self-center" />
            ) : (
              <p className="text-center w-full">Search</p>
            )}
            <span className="animateBorder bottomSpan"></span>
          </button>
          <LongLoadNotification
            isLoading={isLoading}
            showLongLoad={showLongLoad}
          />
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
