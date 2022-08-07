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

export default FormType;
