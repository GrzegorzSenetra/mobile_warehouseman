import * as React from "react";
import * as styles from '../../../../styles';

import Button from "@material-ui/core/Button";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import NativeSelect from '@material-ui/core/NativeSelect';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import Month from '../../../../classes/Month'
import { connect } from "react-redux";
import { setMonthlyNorm, setWorkdays } from "../../../../store/actions/actions";
import { Day } from "../../../../types";

interface IProps {
    month: number,
    year: number,
    changeDate: any,
    storeSetWorkdays: any,
    storeSetMonthlyNorm: any
}
interface IState {}

function DatePicker(props: IProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState(props.month)
  const [year, setYear] = React.useState(props.year)
  const anchorRef = React.useRef<HTMLButtonElement>(null);
  const monthNames = [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ];

  React.useEffect(() => {
    handleSetMonth(month, year)
  }, [])

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: React.MouseEvent<EventTarget>) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  const handleSetMonth = (month: number, year: number) => {
    const mnth = new Month(month, year)
    mnth.loadWorkdays(() => {
      props.storeSetWorkdays(mnth.workdays)
      props.changeDate(month, year)
      handleSetMonthlyNorm(month, year)
    })
  }

  const handleSetMonthlyNorm = (month: number, year: number) => {
    const mnth = new Month(month, year)
    mnth.getMonthlyNorm(() => {
      props.storeSetMonthlyNorm(mnth.monthly_norm)
    })
  }

  const jsxMonthSelector = () => {
    return (
      <div>
        <FormControl>
          <InputLabel htmlFor="uncontrolled-native">Miesiąc</InputLabel>
          <NativeSelect defaultValue={month} onChange={(e) => setMonth(monthNames.indexOf(e.target.value)+1)}>
            {monthNames.map((item: string, index: number) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="uncontrolled-native">Rok</InputLabel>
          <NativeSelect
            defaultValue={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {[props.year - 1, props.year, props.year + 1].map(
              (item: number, index: number) => (
                <option key={index} value={item}>
                  {item}
                </option>
              )
            )}
          </NativeSelect>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          style={styles.button}
          onClick={(e) => {
            handleSetMonth(month, year);
            handleClose(e);
          }}
        >
          OK
        </Button>
      </div>
    );
  }

  return (
    <div style={{width: 400}}>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        onClick={() => {
          let month_changed = month
          let year_changed = year
          if (month - 1 <= 0) {
            setMonth(12);
            setYear(year - 1);
            month_changed = 12
            year_changed = year - 1
          } else if (month - 1 > 0) {
            setMonth(month - 1);
            month_changed = month - 1
          }
          handleSetMonth(month_changed, year_changed);
        }}
        style={{borderTopRightRadius: 0, borderBottomRightRadius: 0}}
      >
        <ArrowLeftIcon fontSize="inherit" />
      </Button>
      <Button
        color="primary"
        ref={anchorRef}
        aria-controls={open ? "menu-list-grow" : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
        style={{
          width: 200,
          height: 26,
          borderColor: "#3f51b5",
          borderWidth: 1,
          borderStyle: "solid",
          borderRadius: 0
        }}
      >
        {monthNames[props.month - 1]} {props.year}
      </Button>
      <Button
        variant="contained"
        color="primary"
        disableElevation
        onClick={() => {
          let month_changed = month
          let year_changed = year
          if (month + 1 > 12) {
            setMonth(1);
            setYear(year + 1);
            month_changed = 1
            year_changed = year + 1
          } else if (month + 1 <= 12) {
            setMonth(month + 1);
            month_changed = month + 1
          }
          handleSetMonth(month_changed, year_changed);
        }}
        style={{borderTopLeftRadius: 0, borderBottomLeftRadius: 0}}
      >
        <ArrowRightIcon fontSize="inherit" />
      </Button>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: 10 }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper style={{ padding: 10 }}>
              <ClickAwayListener onClickAway={handleClose}>
                {/* INSIDE POPUP */}
                {jsxMonthSelector()}
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeSetWorkdays: (workdays: Array<Day>) => dispatch(setWorkdays(workdays)),
    storeSetMonthlyNorm: (monthly_norm: number) => dispatch(setMonthlyNorm(monthly_norm))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DatePicker);
