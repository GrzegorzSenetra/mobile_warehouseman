import Holidays from 'date-holidays';
import * as React from 'react'
import { connect } from 'react-redux';
import { tableStyle } from '../../../../styles';
import * as types from "../../../../types";
import CalendarField from './CalendarField';
import DialogEmployee from '../DialogEmployee/DialogEmployee';
import Employee from '../../../../classes/Employee';

interface IProps {
    employee: types.Employee,
    days: number,
    holidays: Holidays,
    picked_date: {
        month: number,
        year: number
    },
    workdays: Array<types.Day>
}

function CalendarRow(props: IProps){

  const [countedWorkhours, setCountedWorkhours] = React.useState(0)

  React.useEffect(() => {

    const empl = new Employee(
      props.employee.id, 
      props.employee.name, 
      props.employee.surname, 
      props.employee.group,
      props.employee.disabled)
    
    empl.countHours(props.picked_date.month, props.picked_date.year, (hours: number) => {
      try {
        setCountedWorkhours(hours)
      }catch(error) {
        console.log(error)
      }
    })
    
  }, [props.employee.id, props.picked_date.month, props.picked_date.year, props.workdays])

  const generateDaysFields = () => {
      let JSX_Days_Fields = [];
      for(let i = 1; i <= props.days; i++){
          const d = new Date(
            props.picked_date.year,
            props.picked_date.month - 1,
            i - 1
          );
          const d1 = new Date(
            props.picked_date.year,
            props.picked_date.month - 1,
            i
          );
          const weekDay = d.getDay()
          let workday: types.Day = null
          props.workdays.map((item: types.Day, index: number) => {
            if (item.Dzien == i) workday = item
          })
          JSX_Days_Fields.push(
            <CalendarField
              key={i}
              date={d1}
              holidays={props.holidays}
              day={i}
              month={props.picked_date.month}
              year={props.picked_date.year}
              weekDay={weekDay}
              employee={props.employee}
              workday={workday}
              setCountedWorkhours={(workhours: number) => setCountedWorkhours(workhours)}
            />
          );
      }
      return JSX_Days_Fields
  }

  const JSXdaysFields = generateDaysFields()
  
  return (
    <tr style={tableStyle}>
      <DialogEmployee employee={props.employee} />
      {JSXdaysFields}
      <td style={{textAlign: 'center'}}>{countedWorkhours}</td>
    </tr>
  );
}

const mapStateToProps = (state: any) => {
  return {
    employees: state.employees
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarRow)