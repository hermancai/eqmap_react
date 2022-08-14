import React from "react";
import PropTypes from "prop-types";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormSchema from "../models/FormSchema";
import { FormType, defaultFormValues } from "../models/FormType";
import { PencilIcon } from "@heroicons/react/outline";
import FormErrorMessage from "./FormErrorMessage";
import SearchErrorMessage from "./SearchErrorMessage";
import { USGSReturnedObject } from "../models/USGSDataType";
import { getCoordinates } from "../services/geocoder";
import getUSGSdata from "../services/USGSapi";
import useLoadWindowWithGoogle from "../hooks/useLoadWindowWithGoogle";

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
    <p
      className={`self-center w-full text-center text-sm transition-[opacity,max-height,margin-top] duration-700 ease-linear ${
        showLongLoad ? "opacity-100 max-h-56 mt-4" : "max-h-0 opacity-0 mt-0"
      }`}
    >
      Getting data from USGS...<br></br>
      Depending on your search, this may take some time.
    </p>
  );
};

const Form: React.FC<{
  setData: React.Dispatch<React.SetStateAction<USGSReturnedObject | null>>;
}> = ({ setData }) => {
  const { isLoaded } = useLoadWindowWithGoogle();

  const [isLoading, setisLoading] = React.useState<boolean>(false);
  const [showLongLoad, setShowLongLoad] = React.useState<boolean>(false);
  const [searchError, setSearchError] = React.useState<string>("");

  const geocoder: google.maps.Geocoder | null = React.useMemo(() => {
    if (isLoaded) return new window.google.maps.Geocoder();
    return null;
  }, [isLoaded]);

  const onSubmit: SubmitHandler<FormType> = async () => {
    const resetLoading = (): void => {
      setisLoading(false);
      setShowLongLoad(false);
    };

    setData(null);
    setSearchError("");
    setisLoading(true);
    setShowLongLoad(false);
    setTimeout(() => {
      setShowLongLoad(true);
    }, 3000);

    if (geocoder === null) {
      resetLoading();
      return setSearchError("Geocoder failed to load.");
    }

    const geocoderResponse = await getCoordinates(
      geocoder,
      getValues("location")
    );

    if (geocoderResponse.error || !geocoderResponse.res) {
      resetLoading();
      return setSearchError(
        geocoderResponse.error || "Failed to geocode the location"
      );
    }

    const USGSResponse = await getUSGSdata(getValues(), geocoderResponse.res);
    if (USGSResponse.error || !USGSResponse.response) {
      resetLoading();
      return setSearchError(
        USGSResponse.error || "Failed to get data from USGS"
      );
    }

    resetLoading();
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
    <div className="w-[90%] lg:w-1/2 mb-auto flex flex-col justify-center items-center bg-white rounded-md p-6 border-[1px] border-slate-300">
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
            <FormErrorMessage message={errors.location.message} />
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
              <label htmlFor="startDateCheck" className="hover:cursor-pointer">
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
            <FormErrorMessage message={errors.startDate.message} />
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
            <FormErrorMessage message={errors.endDate.message} />
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
            <FormErrorMessage message="Create a magnitude range from 0 to 10." />
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
            <FormErrorMessage message={errors.searchRadius.message} />
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
            <FormErrorMessage message={errors.resultLimit.message} />
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

        {searchError === "" ? null : (
          <SearchErrorMessage message={searchError} />
        )}
      </form>
      <LongLoadNotification showLongLoad={showLongLoad} isLoading={isLoading} />
    </div>
  );
};

Form.propTypes = {
  setData: PropTypes.func.isRequired,
};

export default Form;
