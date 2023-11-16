import * as React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      backgroundColor: theme.palette.background.paper,
    },
  }),
);

export default function RadioList(props: any) {
  const classes = useStyles();
  return (
    <List style={props.style} dense className={classes.root}>
      {Object.keys(props.duplicates_list_instance).map((value: any) => {
        let quantity = props.duplicates_list_instance["quantity"];
        if(value != "quantity"){
            const product = props.duplicates_list_instance[value];
            const labelId = `checkbox-list-secondary-label-${value}`;
            return (
              <ListItem key={value}>
                Kod produktu: &nbsp;
                <ListItemText id={labelId} primary={value} />
                Nazwa produktu: {product[11]}
                <ListItemSecondaryAction>
                  <Checkbox
                    edge="end"
                    color="primary"
                    onChange={props.handleToggle(value, quantity)}
                    checked={props.checked.indexOf(value) !== -1}
                    inputProps={{ 'aria-labelledby': labelId }}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            );
        }else null
      })}
    </List>
  );
}
