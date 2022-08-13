import * as Yup from "yup";
import { FormType } from "./FormType";

// Bug? https://github.com/jquense/yup/issues/1529
const FormSchema: Yup.SchemaOf<FormType> = Yup.object({
  location: Yup.string().required("Enter a location.").trim(),
  startDate: Yup.date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .max(new Date(), "Start date must be earlier than today.")
    .when(
      ["startDateCheck", "endDateCheck"],
      /* @ts-ignore */
      (sCheck: boolean, eCheck: boolean, schema: Yup.DateSchema) => {
        if ((sCheck && eCheck) || sCheck) {
          return schema;
        } else if (!sCheck && !eCheck) {
          return schema
            .required("Choose a starting date.")
            .max(
              Yup.ref("endDate"),
              "Start date must be earlier than end date."
            );
        } else {
          return schema.required("Choose a starting date.");
        }
      }
    ),
  startDateCheck: Yup.boolean(),
  endDate: Yup.date()
    .nullable()
    .transform((curr, orig) => (orig === "" ? null : curr))
    .max(new Date(), "The end date cannot be later than today.")
    .when(
      ["startDateCheck", "endDateCheck"],
      /* @ts-ignore */
      (sCheck: boolean, eCheck: boolean, schema: Yup.DateSchema) => {
        if ((sCheck && eCheck) || eCheck) {
          return schema;
        } else if (!sCheck && !eCheck) {
          return schema
            .required("Choose an ending date.")
            .min(
              Yup.ref("startDate"),
              "End date must be later than start date."
            );
        } else {
          return schema
            .required("Choose an ending date.")
            .min(
              Yup.ref("startDate"),
              "End date must be later than start date."
            );
        }
      }
    ),
  endDateCheck: Yup.boolean(),
  minMag: Yup.number().typeError("").required().min(0).max(Yup.ref("maxMag")),
  maxMag: Yup.number().typeError("").required().min(Yup.ref("minMag")).max(10),
  searchRadius: Yup.number()
    .min(1, "Enter a search radius (1 - 20000).")
    .max(20000, "Enter a search radius (1 - 20000).")
    .typeError("Enter a search radius (1 - 20000).")
    .required("Enter a search radius (1 - 20000)."),
  resultLimit: Yup.number()
    .min(1, "Enter a result limit (1 - 1000).")
    .max(1000, "Enter a result limit (1 - 1000).")
    .typeError("Enter a result limit (1 - 1000).")
    .required("Enter a result limit (1 - 1000)."),
});

export default FormSchema;
