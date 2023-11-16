import * as React from 'react'
import * as types from '../../../../../types'
import * as styles from '../../../../../styles'
import { links } from '../../../../../links'
import { connect } from "react-redux"
import basicDeleteService from '../../../../../services/deleteServices'

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import { Button, Checkbox } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { setGroups } from '../../../../../store/actions/actions'


interface IProps {
    groups: Array<types.Group>,
    storeSetGroups: any
}

function DialogGroupList(props: IProps) {

    const handleDeleteGroup = (group_id: number, index: number) => {
        basicDeleteService(links.GROUP, group_id)
        .then(() => {
            console.log(props.groups)
            let newGroups = [...props.groups]
            newGroups.splice(index, 1)
            props.storeSetGroups(newGroups)
        })
        .catch(error => console.log(error))
    }

    return (
        <div>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell style={styles.groupTableHeadCell}>Nazwa</TableCell>
                            <TableCell style={styles.groupTableHeadCell}>Algorytm</TableCell>
                            <TableCell style={styles.groupTableHeadCell}>Usuń</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {props.groups.map((group: types.Group, index: number) => (
                        <TableRow
                        key={index}
                        >
                            <TableCell style={styles.groupTableCell} component="th" scope="row">
                                <TextField
                                    id="standard-basic"
                                    value={group.name}
                                    // onChange={(e) =>
                                    //     props.storeSetGroups([...props.groups, {id: group.id, name: e.target.value}])
                                    // }
                                />
                            </TableCell>
                            <TableCell style={styles.groupTableCell}>
                                <Checkbox
                                    checked={group.algorithm}
                                    value={group.algorithm}
                                    // onChange={() =>
                                    //     props.storeSetGroups([...props.groups, {...group, algorithm: !group.algorithm}])
                                    // }
                                />
                            </TableCell>
                            <TableCell style={styles.groupTableCell} align="right">
                                <Button onClick={() => handleDeleteGroup(group.id, index)}>
                                    <DeleteIcon style={{color: 'red'}} />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
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
  
export default connect(mapStateToProps, mapDispatchToProps)(DialogGroupList);