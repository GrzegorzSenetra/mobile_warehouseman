import * as React from "react";
import * as styles from '../styles'
import Grid from "@material-ui/core/Grid";

import CalendarTable from '../components/App/CalendarTable';
import ToolBar from '../components/App/Toolbar/ToolBar';

interface IProps {}
interface IState {
  d: Date,
  picked_date: {
    month: number,
    year: number
  }
}

export default class PlanCreatorView extends React.PureComponent<IProps, IState> {
  constructor(props: any) {
    super(props);
    const d = new Date();
    this.state = {
      d: d,
      picked_date: {
        month: d.getMonth() + 1,
        year: d.getFullYear(),
      },
    };
  }

  public componentRef = React.createRef<HTMLDivElement>().current

  daysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };

  changeDate = (month: number, year: number) => {
    const picked_date = { month: month, year: year };
    this.setState({ picked_date: picked_date });
  };

  render() {
    const d = new Date(
      this.state.picked_date.year,
      this.state.picked_date.month - 1
    );
    const daysInMonth = this.daysInMonth(d.getMonth() + 1, d.getFullYear());

    return (
      <div style={{flexGrow: 1, marginTop: 20, marginBottom: 20}}>
        <div ref={el => (this.componentRef = el)} style={styles.calendarTableDiv}>
          <ToolBar 
            componentRef={this.componentRef}
            picked_date={this.state.picked_date} 
            changeDate={(month: number, year: number) => this.changeDate(month, year)} 
          />
          <Grid container spacing={3} style={{marginTop: 20}}>
              <CalendarTable daysInMonth={daysInMonth} picked_date={this.state.picked_date} id={"CalendarTable"} /> 
          </Grid>
        </div>
      </div>
    );
  }
}
