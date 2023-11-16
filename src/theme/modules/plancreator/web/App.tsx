import * as React from 'react'
import { connect } from 'react-redux'
import { Employee, Group, WorkHour } from './types'
import { setEmployees, setGroups, setWorkhours } from './store/actions/actions'
import {basicGetService} from './services/getServices'
import { links } from './links'
import PlanCreatorView from './views/PlanCreatorView'

interface IProps {
  storeSetEmployees: any,
  storeSetGroups: any,
  employees: Array<Employee>,
  storeSetWorkHours: any
}
interface IState {}

class App extends React.Component<IProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.downloadInitData();
    setTimeout(() => {
      console.log("APP TIMEOUT")
      console.log(this.props.employees)
    }, 30000)
  };

  downloadInitData = () => {
    basicGetService(links.GET_INIT_DATA, "")
      .then((response: any) => response.json())
      .then((responseJson: any) => {
        console.log(responseJson)
        this.addEmployeesToStore(responseJson)
        this.addGroupsToStore(responseJson)
        this.addWorkHoursToStore(responseJson)
      })
      .catch((error) => console.log(error));
  };

  addWorkHoursToStore = (init_data: any) => {
    let workhours: Array<WorkHour> = [];
    init_data.workhours.map((workhour: any, index: number) => {
      const WorkHour: WorkHour = this.adaptWorkHour(workhour);
      workhours.push(WorkHour);
    })
    this.props.storeSetWorkHours(workhours);
  }

  adaptWorkHour = (workhour: any) => {
    const WorkHour: WorkHour = {
      id: workhour.id,
      name: workhour.Nazwa,
      hours: workhour.Godz_pracy
    }
    return WorkHour
  }

  addEmployeesToStore = (init_data: any) => {
    let employees: Array<Employee> = [];
    init_data.employees.map((employee: any, index: number) => {
      const Employee: Employee = this.adaptEmployee(employee);
      employees.push(Employee);
    });
    this.props.storeSetEmployees(employees);
  };

  adaptEmployee = (employee: any) => {
    const Employee: Employee = {
      id: employee.id,
      name: employee.Imie_i_nazwisko.split(" ")[0],
      surname: employee.Imie_i_nazwisko.split(" ")[1],
      group: employee.Grupa_id,
      disabled: employee.Czy_niepelnosprawny
    };
    return Employee;
  };

  addGroupsToStore = (init_data: any) => {
    let groups: Array<Group> = [];
    init_data.groups.map((group: any, index: number) => {
      const Group: Group = this.adaptGroup(group);
      groups.push(Group);
    });
    this.props.storeSetGroups(groups);
  };

  adaptGroup = (group: any) => {
    const Group: Group = {
      id: group.id,
      name: group.Nazwa,
      algorithm: group.Algorytm
    }
    return Group
  }

  render() {
    return (
      <div>
        <h2>Generator grafików pracy</h2>
        <div>
          <PlanCreatorView />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    employees: state.employees
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeSetEmployees: (employees: Array<Employee>) => dispatch(setEmployees(employees)),
    storeSetGroups: (groups: Array<Group>) => dispatch(setGroups(groups)),
    storeSetWorkHours: (workhours: Array<WorkHour>) => dispatch(setWorkhours(workhours))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
