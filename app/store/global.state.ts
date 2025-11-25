import { proxy } from "valtio";
import dayjs from "dayjs";

export const currentDateState = proxy({
  day: dayjs(),
});
