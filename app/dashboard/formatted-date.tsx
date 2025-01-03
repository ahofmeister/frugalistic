"use client";
import { formatDate } from "date-fns";

import { useSetting } from "@/app/dashboard/settings/use-setting";

const FormattedDate = (props: { date: string }) => {
  const setting = useSetting();

  return formatDate(props.date, setting.date_format);
};

export default FormattedDate;
