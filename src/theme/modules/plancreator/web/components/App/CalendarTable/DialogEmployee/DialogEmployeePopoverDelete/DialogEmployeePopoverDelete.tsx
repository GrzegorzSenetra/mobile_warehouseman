import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import Employee from '../../../../../classes/Employee';
import * as types from '../../../../../types'
import { setEmployees } from '../../../../../store/actions/actions';
import { connect } from 'react-redux';

interface IProps {
    employee: types.Employee,
    employees: Array<types.Employee>,
    storeSetEmployees: any,
    handleCloseEmployeeProfile: any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
  }),
);

function DialogEmployeePopoverDelete(props:IProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteEmployee = () => {
    let empl = new Employee(
      props.employee.id, 
      props.employee.name, 
      props.employee.surname, 
      props.employee.group,
      props.employee.disabled
    );

    if(empl.removeEmployee()) {
      let employees:Array<types.Employee> = []
      props.employees.map((employee:types.Employee, index: number) => {
        if(employee.id != props.employee.id) employees.push(employee)
      })
      props.storeSetEmployees(employees)
      handleClose()
      props.handleCloseEmployeeProfile()
    }
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Button variant="outlined" color="secondary" onClick={handleClick}>
        <DeleteIcon /> USUŃ PRACOWNIKA
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography className={classes.typography}>
          Czy na pewno chcesz usunąć pracownika? <br />
        </Typography>
        <div style={{ float: "right", margin: 10 }}>
          <Button color="primary" onClick={handleClose}>
            ANULUJ
          </Button>
          <Button color="secondary" onClick={handleDeleteEmployee}>
            USUŃ
          </Button>
        </div>
      </Popover>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    employees: state.employees
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeSetEmployees: (employees: Array<types.Employee>) => dispatch(setEmployees(employees))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogEmployeePopoverDelete);
