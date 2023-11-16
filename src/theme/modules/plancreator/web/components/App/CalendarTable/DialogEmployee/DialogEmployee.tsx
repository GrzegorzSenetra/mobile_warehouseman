import * as React from "react";
import * as types from "../../../../types";
import Employee from '../../../../classes/Employee';
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import DialogEmployeePopoverDelete from './DialogEmployeePopoverDelete/DialogEmployeePopoverDelete';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from "@material-ui/core/NativeSelect";
import { connect } from "react-redux";
import { setEmployees, updateEmployee } from "../../../../store/actions/actions";
import Checkbox from "@material-ui/core/Checkbox";

interface IProps {
  employee: types.Employee,
  groups: Array<types.Group>,
  storeSetEmployees: any,
  employees: Array<types.Employee>,
  storeUpdateEmployee: any
}

function DialogEmployee(props: IProps) {
  const [open, setOpen] = React.useState(false);
  const [employee, setEmployee] = React.useState(props.employee)

  const handleClickOpen = () => {
    setEmployee(props.employee);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    let empl = new Employee(
      employee.id,
      employee.name,
      employee.surname,
      employee.group,
      employee.disabled
    );
    if(empl.updateEmployee()) {
      props.storeUpdateEmployee(empl.attributes)
      handleClose()
    }
  };

  return (
    <td>
      <a onClick={handleClickOpen} style={{ color: "blue" }}>
        {props.employee.name} {props.employee.surname}{" "}
      </a>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Profil pracownika"}</DialogTitle>
        <DialogContent>
          <div style={{ float: "left" }}>
            <TextField
              id="standard-basic"
              label="Imię"
              value={employee.name}
              onChange={(e) =>
                setEmployee({ ...employee, name: e.target.value })
              }
            />
            <br />
            <TextField
              id="standard-basic"
              label="Nazwisko"
              value={employee.surname}
              onChange={(e) =>
                setEmployee({ ...employee, surname: e.target.value })
              }
            />
            <br />
            <Checkbox
              checked = {employee.disabled}
              onChange={() => {
                setEmployee({...employee, disabled: !employee.disabled})
              }}
              value={employee.disabled}
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            Niepełnosprawny
            <br />
            <FormControl>
              <InputLabel shrink htmlFor="age-native-label-placeholder">
                Grupa
              </InputLabel>
              <NativeSelect
                value={employee.group}
                onChange={(event) =>
                  setEmployee({ ...employee, group: parseInt(event.target.value) })
                }
              >
                {props.groups.map(
                  (group: types.Group, index: number) => (
                    <option key={index} value={group.id}>
                      {group.name}
                    </option>
                  )
                )}
              </NativeSelect>
            </FormControl>
          </div>
          <div style={{ float: "right" }}>
            <DialogEmployeePopoverDelete
              employee={props.employee}
              handleCloseEmployeeProfile={handleClose}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Anuluj
          </Button>
          <Button onClick={handleSave} color="primary" autoFocus>
            Zapisz
          </Button>
        </DialogActions>
      </Dialog>
    </td>
  );
}

const mapStateToProps = (state: any) => {
  return {
    groups: state.groups,
    employees: state.employees
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeSetEmployees: (employees: Array<types.Employee>) => dispatch(setEmployees(employees)),
    storeUpdateEmployee: (employee: types.Employee) => dispatch(updateEmployee(employee))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogEmployee);
