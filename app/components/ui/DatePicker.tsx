import { ChevronLeft, ChevronRight } from "@untitledui/icons";
import {
  Button,
  ButtonProps,
  Calendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader,
  CalendarHeaderCell,
  Heading,
} from "react-aria-components";

function RoundButton(props: ButtonProps) {
  return (
    <Button
      {...props}
      className="flex justify-center items-center bg-transparent hover:bg-gray-100 pressed:bg-gray-200 border-0 rounded-full outline-hidden ring-violet-600/70 focus-visible:ring-3 ring-offset-2 w-9 h-9 text-gray-600 cursor-pointer"
    />
  );
}

export default function DatePicker() {
  return (
    <Calendar>
      <header className="flex items-center gap-1 px-1 pb-4 w-full font-serif">
        <Heading className="flex-1 ml-2 font-semibold text-2xl" />
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
            <CalendarHeaderCell className="font-semibold text-gray-500 text-xs">
              {day}
            </CalendarHeaderCell>
          )}
        </CalendarGridHeader>
        <CalendarGridBody>
          {(date) => (
            <CalendarCell
              date={date}
              className="flex justify-center items-center hover:bg-gray-100 pressed:bg-gray-200 selected:bg-violet-700 rounded-full outline-hidden ring-violet-600/70 focus-visible:ring-3 ring-offset-2 w-9 h-9 outside-month:text-gray-300 selected:text-white cursor-pointer"
            />
          )}
        </CalendarGridBody>
      </CalendarGrid>
    </Calendar>
  );
}
