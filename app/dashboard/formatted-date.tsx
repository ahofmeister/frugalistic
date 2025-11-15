"use client";
import { formatDate } from "date-fns";

const FormattedDate = (props: { date: string; format: string }) => {
  return formatDate(props.date, props.format);
};

export default FormattedDate;
