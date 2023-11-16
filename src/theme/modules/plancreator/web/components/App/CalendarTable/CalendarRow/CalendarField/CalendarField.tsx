import * as React from "react";
import Holidays from "date-holidays";
import { tableField } from '../../../../../styles';
import CalendarFieldPopover from "../../CalendarFieldPopover/CalendarFieldPopover";
import { Day, Employee } from "../../../../../types";
import ReactTooltip from "react-tooltip";

interface IProps {
    holidays: Holidays,
    date: Date,
    weekDay: number,
    day: number,
    month: number,
    year: number,
    employee: Employee,
    workday: Day,
    setCountedWorkhours: any
}

const CalendarFieldPopoverLazy = React.lazy(() => Promise.resolve({
  default: CalendarFieldPopover
}))

export default function CalendarField(props: IProps) {

  const [workday, setWorkday] = React.useState(null)

  React.useEffect(() => {
    ReactTooltip.rebuild();
    setWorkday(props.workday)
  },[props.workday]);

  return (
    <td
      style={
        props.holidays.isHoliday(props.date)
          ? {
              ...tableField,
              backgroundColor: "rgba(255,255,0,0.1)",
              color: "blue",
            }
          : props.weekDay == 6
          ? { ...tableField, backgroundColor: "rgba(255,0,0,0.1)" }
          : props.weekDay == 5
          ? { ...tableField, backgroundColor: "rgba(0,0,0,0.1)" }
          : tableField
      }
      data-for='overTime'
    >

      <React.Suspense fallback={<div>...</div>}>
        <CalendarFieldPopoverLazy
          day={props.day}
          month={props.month}
          year={props.year}
          employee={props.employee}
          workday={workday}
          setWorkday={(workday: Day) => setWorkday(workday)}
          setCountedWorkhours={(workhours: number) => props.setCountedWorkhours(workhours)}
        />
      </React.Suspense>
    </td>
  );
}
