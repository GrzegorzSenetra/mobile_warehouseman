import * as React from "react";
import * as styles from "../../../styles";
import * as services from '../../../services/putServices';
import { links } from '../../../links';
import * as types from '../../../types';

import Grid from "@material-ui/core/Grid";
import ReactToPrint from "react-to-print";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";

import DatePicker from "./DatePicker/DatePicker";
import DialogGroup from './DialogGroup/DialogGroup';
import { connect } from "react-redux";
import { setDate, setWorkdays, updateWorkdays } from "../../../store/actions/actions";
import Employee from "../../../classes/Employee";

interface IProps {
    componentRef: any,
    picked_date: {
        month: number,
        year: number
    },
    changeDate: any,
    storeSetWorkdays: any,
    monthly_norm: number
}

async function updateRow(row: Array<types.Day>, storeUpdateWorkdays: any) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(storeUpdateWorkdays(row));
    }, 3000);
  });
}

function ToolBar(props: IProps) {

  const handleFillInByGroups = () => {
    const data = {
      method: 'fillByGroups',
      date: props.picked_date
    }
    services.asyncPutService(links.GROUP, data)
    .then((response: any) => response.json())
    .then((responseJson: any) => {
      props.storeSetWorkdays(responseJson)
    })
    .catch(error => console.log(error))
  }

  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <DatePicker
          month={props.picked_date.month}
          year={props.picked_date.year}
          changeDate={(month: number, year: number) =>
            props.changeDate(month, year)
          }
        />
        <br />
        <ReactToPrint
          trigger={() => {
            // NOTE: could just as easily return <SomeComponent />. Do NOT pass an `onClick` prop
            // to the root node of the returned component as it will be overwritten.
            return (
              <IconButton
                aria-label="print"
                color="primary"
              >
                &#128424;s
              </IconButton>
            );
          }}
          content={() => props.componentRef}
        />
        <DialogGroup />
        <Button
          style={styles.toolbarButton}
          variant="outlined"
          color="primary"
          disableElevation
          onClick={handleFillInByGroups}
        >
          Uzupełnij według grup
        </Button>
        <span>Godzinowa norma miesięczna: {props.monthly_norm}</span>
      </Grid>
    </Grid>
  );
}

const mapStateToProps = (state: any) => {
  return {
    monthly_norm: state.monthly_norm
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeSetWorkdays: (workdays: Array<types.Day>) => dispatch(setWorkdays(workdays))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar);
