import * as React from "react";
import Holidays from "date-holidays";
import DialogEmployeeCreate from "./DialogEmployeeCreate/DialogEmployeeCreate";
import CalendarRow from "./CalendarRow";
import { connect } from "react-redux";
import { Day, Employee } from "../../../types";
import ReactTooltip from 'react-tooltip';
import * as styles from '../../../styles';

interface IProps {
  daysInMonth: number,
  picked_date: {
    month: number,
    year: number
  },
  employees: Array<Employee>,
  workdays: Array<Day>,
  tooltip: string,
  id: string
}

const CalendarTable = React.memo((props: IProps) => {

  const holidays = new Holidays("PL")

  const generateDaysColumns = (days: number) => {
    let JSX_Columns = []
    for (let i = 1; i <= days; i++) {
        const d = new Date(
          props.picked_date.year,
          props.picked_date.month - 1,
          i-1
        );
        const d1 = new Date(
          props.picked_date.year,
          props.picked_date.month - 1,
          i
        );
        const weekDay = d.getDay()
        JSX_Columns.push(
          <th
            style={
              holidays.isHoliday(d1)
                ? { ...tableStyle, backgroundColor: "yellow", color: 'blue' }
                : weekDay == 6
                ? { ...tableStyle, backgroundColor: "red" }
                : weekDay == 5
                ? { ...tableStyle, backgroundColor: "grey" }
                : tableStyle
            }
            key={i}
          >
            {i}
          </th>
        );
    }
    return JSX_Columns;
  };

  const generateEmployeesRows = (employees: Array<Employee>) => {
    let JSX_Rows: any[] = []
    employees.map((employee: Employee, index: number) => {
      let employee_workdays: Array<Day> = []
      props.workdays.map((workday: Day, jndex: number) => {
        if (employee.id == workday.Pracownik_id) employee_workdays.push(workday)
      })
      JSX_Rows.push(
        <CalendarRow
          key={index}
          days={props.daysInMonth}
          employee={employee}
          holidays={holidays}
          picked_date={props.picked_date}
          workdays={employee_workdays}
        />
      );
    })
    return JSX_Rows
  }

  const daysColumns = generateDaysColumns(props.daysInMonth);
  const employeesRows = generateEmployeesRows(props.employees);

  return (
    <div id={props.id}>
      <table
        style={{ borderCollapse: "collapse" }}
      >
        <thead 
          data-tip={`Edytuj całą kolumnę`}
          data-for='overTime'
          style={{ backgroundColor: "#3f51b5", color: "white" }}>
          <tr>
            <th style={tableStyle}>Pracownik</th>
            {daysColumns}
            <th style={tableStyle}>Ilość Godz.</th>
          </tr>
        </thead>
        <tbody
          data-tip={`${1} ${2} ${3}`}
          data-for='overTime'>
        {/* <tbody> */}
          {employeesRows}
          <tr>
            <td>
              <DialogEmployeeCreate />
            </td>
          </tr>
        </tbody>
      </table>
      <ReactTooltip id="overTime" />
    </div>
  );
})

const tableStyle = styles.tableCell

const mapStateToProps = (state: any) => {
  return {
    employees: state.employees,
    workdays: state.workdays,
    tooltip: state.tooltip
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarTable);
