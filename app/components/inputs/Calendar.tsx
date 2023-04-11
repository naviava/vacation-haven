"use client";

// External packages.
import { DateRange, Range, RangeKeyDict } from "react-date-range";

// react-date-range styles.
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface CalendarProps {
  dateRange: Range;
  onChange: (value: RangeKeyDict) => void;
  disabledDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({
  dateRange,
  onChange,
  disabledDates,
}) => {
  return (
    <DateRange
      rangeColors={["#919191"]}
      ranges={[dateRange]}
      date={new Date()}
      onChange={onChange}
      direction="horizontal"
      showDateDisplay={false}
      minDate={new Date()}
      disabledDates={disabledDates}
    />
  );
};
export default Calendar;
