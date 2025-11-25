import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import {
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
} from "react-aria-components";
import { useSnapshot } from "valtio";
import { currentDateState } from "@/app/store/global.state";
import dayjs from "dayjs";
import { CalendarDate, toCalendarDate } from "@internationalized/date";
import RoundButton from "./RoundButton";

export default function DatePicker({
  onSelected,
}: {
  onSelected?: () => void;
}) {
  const currentDateSnapshot = useSnapshot(currentDateState);

  const handleDateSelect = (date: CalendarDate) => {
    currentDateState.day = dayjs(
      `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`,
    );
    if (onSelected) {
      onSelected();
    }
  };

  const year = currentDateSnapshot.day.year();
  const month = currentDateSnapshot.day.month() + 1;
  const day = currentDateSnapshot.day.date();

  const selectedDate = new CalendarDate(year, month, day);

  return (
    <Calendar value={selectedDate} onChange={handleDateSelect}>
      <header className="flex w-full items-center gap-1 px-1 pb-4 font-serif">
        <Heading className="ml-2 flex-1 font-sans text-2xl font-semibold" />
        <RoundButton slot="previous" className="cursor-pointer">
          <ChevronLeft />
        </RoundButton>
        <RoundButton slot="next" className="cursor-pointer">
          <ChevronRight />
        </RoundButton>
      </header>
      <CalendarGrid className="border-separate border-spacing-1">
        <CalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className="text-xs font-semibold text-gray-500">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className="pressed:bg-gray-200 selected:bg-accent outside-month:text-gray-300 selected:text-white flex h-9 w-9 cursor-pointer items-center justify-center rounded-full ring-violet-600/70 ring-offset-2 outline-hidden hover:bg-gray-100 focus-visible:ring-3"
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  );
}
