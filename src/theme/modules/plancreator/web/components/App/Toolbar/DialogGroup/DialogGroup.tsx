import * as React from "react";
import * as types from '../../../../types';
import * as styles from '../../../../styles';
import { links } from '../../../../links';
import { connect } from "react-redux";
import { syncPostService } from "../../../../services/postServices";
import { setGroups } from "../../../../store/actions/actions";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import TextField from "@material-ui/core/TextField";
import AddIcon from '@material-ui/icons/Add';
import Checkbox from "@material-ui/core/Checkbox";

import DialogGroupList from './DialogGroupList/DialogGroupList'


interface IProps {
  groups: Array<types.Group>,
  storeSetGroups: any
}

const c_styles = {
    editContainer: {
        borderStyle: 'solid', 
        borderWidth: 1, 
        borderRadius: 5, 
        borderColor: 'green',
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 0,
        paddingBottom: 10,
        marginTop: 20
    }
}

function DialogGroup(props: IProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  const [group, setGroup] = React.useState<types.Group>({id: 0, name: '', algorithm: false})

  React.useEffect(() => {

  }, [])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    handleClose();
  };

  const handleAddGroup = () => {
    syncPostService(links.GROUP, group)
    .then((response: any) => response.json())
    .then((responseJSON: any) => {
      console.log(responseJSON)
      props.storeSetGroups([...props.groups, responseJSON])
    })
    .catch(error => console.log(error))
  }

  return (
    <div>
      <Button
          style={styles.toolbarButton}
          variant="outlined"
          color="primary"
          disableElevation
          onClick={handleClickOpen}
      >
            Grupy
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Zarządzaj Grupami"}</DialogTitle>
        <DialogContent>
          <DialogGroupList />
          <div style={{...c_styles.editContainer, float: 'left'}}>
            <TextField
              id="standard-basic"
              label="Dodaj nową grupę"
              value={group.name}
              onChange={(e) =>
                setGroup({...group, name: e.target.value})
              }
            />
            <Checkbox
              checked={group.algorithm}
              onChange={() => 
                setGroup({...group, algorithm: !group.algorithm})
              }
              value={group.algorithm}
            />
            <Button 
              style={{ marginLeft: 40, marginTop: 10 }}
              onClick={handleAddGroup}
            >
              <AddIcon style={{color: 'green'}} />
            </Button>
            <br />
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
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    groups: state.groups
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    storeSetGroups: (groups: Array<types.Group>) => dispatch(setGroups(groups))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(DialogGroup);
