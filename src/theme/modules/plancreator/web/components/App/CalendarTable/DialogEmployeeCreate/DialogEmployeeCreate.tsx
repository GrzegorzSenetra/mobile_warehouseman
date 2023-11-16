import * as React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from "@material-ui/icons/Add";
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputLabel from '@material-ui/core/InputLabel';

import Employee from '../../../../classes/Employee';
import * as types from '../../../../types'
import { connect } from 'react-redux';
import { setEmployees } from '../../../../store/actions/actions';
import Checkbox from '@material-ui/core/Checkbox';


interface IProps {
  employees: Array<types.Employee>,
  groups: Array<types.Group>,
  storeSetEmployees: any
}

function DialogEmployeeCreate(props: IProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [employee, setEmployee] = React.useState<types.Employee>({id: null,name: '', surname: '', group: 1, disabled: false})

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    let empl = new Employee(null, employee.name, employee.surname, employee.group, employee.disabled)
    empl.createEmployee(() => {
      try {
        addToStoreAndClearState(empl.attributes)
      }catch(error){
        console.log(error)
      }
    })
  }

  const addToStoreAndClearState = (employee: types.Employee) => {
    props.storeSetEmployees([...props.employees, employee])
    handleClose()
    setEmployee({id: null, name: '', surname: '', group: employee.group, disabled: false})
  }

  return (
    <div>
      <Button
        color="primary"
        style={{ borderRadius: 0, fontSize: 12 }}
        onClick={handleClickOpen}
      >
        Nowy Pracownik
        <AddIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Dodaj Pracownika</DialogTitle>
        <DialogContent>
          <DialogContentText>Wprowadź dane pracownika.</DialogContentText>
          <TextField
            className="textField"
            autoFocus
            margin="dense"
            id="name"
            label="Imię"
            type="text"
            onChange={(event) => setEmployee({...employee, name: event.target.value})}
          />
          <br />
          <TextField
            className="textField"
            margin="dense"
            id="name"
            label="Nazwisko"
            type="text"
            onChange={(event) => setEmployee({...employee, surname: event.target.value})}
          />
          <br />
          <FormControl>
            <InputLabel shrink htmlFor="age-native-label-placeholder">
              Grupa
            </InputLabel>
            <NativeSelect
              value={employee.group}
              onChange={(event) => setEmployee({...employee, group: parseInt(event.target.value)})}
            >
              {props.groups.map((group: types.Group, index: number) => (
                <option key={index} value={group.id}>
                  {group.name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <br />
          <Checkbox
            // checked = {false}
            onChange={() => {
              setEmployee({...employee, disabled: !employee.disabled})
              
            }}
            value={employee.disabled}
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
          Niepełnosprawny
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Anuluj
          </Button>
          <Button onClick={handleSave} color="primary">
            Zatwierdź
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    employees: state.employees,
    groups: state.groups
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeSetEmployees: (employees: Array<types.Employee>) => dispatch(setEmployees(employees))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogEmployeeCreate);
