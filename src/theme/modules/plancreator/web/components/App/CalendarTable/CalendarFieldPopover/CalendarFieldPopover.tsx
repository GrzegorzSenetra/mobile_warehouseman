import * as React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';
import { connect } from 'react-redux';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import NativeSelect from '@material-ui/core/NativeSelect';
import * as types from '../../../../types';
import Day from '../../../../classes/Day';
import { setTooltip, setTooltipInterval, setWorkdays, updateWorkdays } from '../../../../store/actions/actions';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormLabel from '@material-ui/core/FormLabel';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import CalendarFieldButton from '../CalendarRow/CalendarField/CalendarFieldButton';
import Employee from '../../../../classes/Employee';

interface IProps {
  workhours: Array<types.WorkHour>,
  day: number,
  month: number,
  year: number,
  employee: types.Employee,
  workday: types.Day,
  setWorkday: any,
  workdays: Array<types.Day>,
  storeSetTooltip: any,
  tooltip: string,
  storeSetTooltipInterval: any,
  storeSetWorkdays: any,
  storeUpdateWorkdays: any,
  setCountedWorkhours: any
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    button: {
        padding: 0,
        borderRadius: 0,
        borderWidth: 0,
        height: 40,
        cursor: 'cell'
    }
  }),
);

function CalendarFieldPopover(props:IProps) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [workhour, setWorkhour] = React.useState<number>(props.workday ? props.workday.Zmiana_id : 1)
  const [workday, setWorkday] = React.useState<types.Day>(props.workday)
  const [radioValue, setRadioValue] = React.useState('single')

  React.useEffect(() => {
    setWorkday(props.workday)
  }, [])
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSave = () => {
    saveData()
  }

  const saveData = () => {
    const day = new Day(
      null, 
      workhour == 5 ? false : true, 
      props.employee.id, 
      workhour, 
      props.day, 
      props.month, 
      props.year,
      1
    )
    day.updateDay(radioValue, props.workdays).then((result: any) => {
      if (!Array.isArray(result)) {
        setWorkday(result)
        console.log(result)
      }else{
        console.log(result)
        props.storeUpdateWorkdays(result)
      }
    })
    .then(() => {
      let empl = new Employee(
        props.employee.id, 
        props.employee.name, 
        props.employee.surname, 
        props.employee.group,
        props.employee.disabled)
      
      empl.countHours(props.month, props.year, (hours: number) => {
        try {
          console.log(hours)
          props.setCountedWorkhours(hours)
        }catch(error) {
          console.log(error)
        }
      })
    })
    .then(() => {
      handleClose()
      if(workhour == 69) {
        let newWorkdays = [...props.workdays]
        let indexOfSplicedWorkday = newWorkdays.findIndex(element => element == props.workday)
        newWorkdays.splice(indexOfSplicedWorkday, 1)
        setWorkday(null)
        props.setWorkday(null)
      }
    })
    .catch(error => alert(error))
  }

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return (
    <div
      style={{ padding: 0 }}
      data-tip={
        `Pracownik: ${props.employee.name} ${props.employee.surname}\n
        Dzień: ${props.day}`
      }
      data-for='overTime'
    >
      <CalendarFieldButton
        handleClick = { handleClick } 
        classesButton = { classes.button }
        workday = { workday }
        pworkday = { props.workday }
      />
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
          <FormControl>
            <InputLabel htmlFor="uncontrolled-native">Zmiana</InputLabel>
            <NativeSelect
              autoFocus
              defaultValue={workhour}
              onChange={(e) => setWorkhour(parseInt(e.target.value))}
            >
              {props.workhours.map((item: types.WorkHour, index: number) => (
                <option key={index} value={item.id}>
                  {item.name} : {item.hours}
                </option>
              ))}
              <option key={69} value={69}> {/* 69 means delete status */}
                Usuń
              </option>
            </NativeSelect>
          </FormControl>
          <FormControl component="fieldset">
            <FormLabel component="legend">Jak uzupełnić? :</FormLabel>
            <RadioGroup aria-label="method" name="method" value={radioValue} onChange={(e) => setRadioValue(e.target.value)}>
              <FormControlLabel value="single" control={<Radio />} label="Pojedyńczo" />
              <FormControlLabel value="tostartfrom" control={<Radio />} label="Co tygodniowo na przemian" />
              <FormControlLabel value="onlyone" control={<Radio />} label="Cały wiersz" />
            </RadioGroup>
          </FormControl>
          <Button
            style={{ top: 12, left: 10 }}
            variant="outlined"
            onClick={handleSave}
            color="primary"
          >
            <SaveIcon />
          </Button>
        </Typography>
      </Popover>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    workhours: state.workhours,
    workdays: state.workdays,
    tooltip: state.tooltip
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeSetTooltip: (tooltip: string) => dispatch(setTooltip(tooltip)),
    storeSetTooltipInterval: (tooltipInterval: any) => dispatch(setTooltipInterval(tooltipInterval)),
    storeSetWorkdays: (workdays: Array<types.Day>) => dispatch(setWorkdays(workdays)),
    storeUpdateWorkdays: (workdays: Array<types.Day>) => dispatch(updateWorkdays(workdays))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CalendarFieldPopover);
