type FormType = {
  location: string;
  startDate?: Date | string | null;
  startDateCheck?: boolean;
  endDate?: Date | string | null;
  endDateCheck?: boolean;
  minMag: number;
  maxMag: number;
  searchRadius: number;
  resultLimit: number;
};

const formatDate = (date: Date): string => {
  return [
    date.getFullYear(),
    (date.getMonth() + 1).toString().padStart(2, "0"),
    date.getDate().toString().padStart(2, "0"),
  ].join("-");
};

const defaultFormValues: FormType = {
  location: "San Francisco",
  startDate: "1900-01-01",
  startDateCheck: false,
  endDate: formatDate(new Date()),
  endDateCheck: true,
  minMag: 6,
  maxMag: 10,
  searchRadius: 100,
  resultLimit: 20,
};

export { type FormType, defaultFormValues };
