import { FC, Dispatch, SetStateAction } from "react";
import PropTypes from "prop-types";
import { useForm, SubmitHandler } from "react-hook-form";
import { PencilIcon } from "@heroicons/react/outline";
import ErrorMessage from "./ErrorMessage";
import USGSDataType from "../models/USGSDataType";

type FormData = {
  location: string;
  startDate: Date;
  endDate: Date;
  minMag: number;
  maxMag: number;
  searchRadius: number;
  resultLimit: number;
};

const Form: FC<{
  displayData: Dispatch<SetStateAction<USGSDataType | null>>;
}> = ({ displayData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ reValidateMode: "onBlur" });
  const onSubmit: SubmitHandler<FormData> = (data) => console.log(data);

  return (
    <div className="flex flex-col justify-center items-center">
      <p className="text-center">
        Search for earthquake data by filling the form and clicking Search
        below.
      </p>
      <button className="flex flex-row flex-nowrap items-center border-2 border-slate-800">
        <PencilIcon className="h-4" />
        Auto-fill Form
      </button>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full space-y-3"
      >
        <div className="formSection">
          <label className="formLabel">Location</label>
          <input
            className="formInput"
            placeholder="The area to search for quakes"
            {...register("location", { required: true })}
          />
          {errors.location ? (
            <ErrorMessage message="Enter a location." />
          ) : null}
        </div>

        <div className="formSection">
          <label className="formLabel">Start Date</label>
          <input
            type="text"
            placeholder="Starting date of quake events"
            className="formInput"
            {...register("startDate", { required: true })}
            onFocus={(e) => (e.target.type = "date")}
          />
          {errors.startDate ? (
            <ErrorMessage message="Enter a starting date." />
          ) : null}
        </div>

        <div className="formSection">
          <label className="formLabel">End Date</label>
          <input
            type="text"
            placeholder="Ending date of quake events"
            className="formInput"
            {...register("endDate", { required: true })}
            onFocus={(e) => (e.target.type = "date")}
          />
          {errors.endDate ? (
            <ErrorMessage message="Enter an ending date." />
          ) : null}
        </div>

        <div className="formSection">
          <label className="formLabel">Magnitude</label>
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
          <label className="formLabel">Search Radius</label>
          <input
            type="text"
            placeholder="Radius in kilometers of the search area"
            className="formInput"
            {...register("searchRadius", { required: true })}
          />
          {errors.searchRadius ? (
            <ErrorMessage message="Enter a search radius (0 - 20000)." />
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
            <ErrorMessage message="Enter a result limit (0 - 1000)." />
          ) : null}
        </div>

        <button type="submit">Search</button>
      </form>
    </div>
  );
};

Form.propTypes = {
  displayData: PropTypes.func.isRequired,
};

export default Form;
