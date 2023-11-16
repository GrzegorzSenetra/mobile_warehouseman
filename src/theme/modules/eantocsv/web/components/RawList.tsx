import * as React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import ExpandMore from '@material-ui/icons/ExpandMore';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { Button } from '@material-ui/core';

import host from '../../../../../config/host';
import RadioList from './RadioList';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        nested: {
            paddingLeft: theme.spacing(6),
        },
    }),
);

export default function RawList(props: any) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([]);
    const [checkedQuantity, setCheckedQuantity] = React.useState([]);
    const [open, setOpen] = React.useState(false);
    const [newList, setNewList] = React.useState();
    let duplicates_list = props.duplicates_list;

    const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
    
        setOpen(false);
      };    

    const handleToggle = (value: any, quantity: number) => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        let checkedObj = {
            "id": value,
            "quantity": quantity
        }

        const newCheckedQuantity = [...checkedQuantity];

        if (currentIndex === -1) {
            newChecked.push(value);
            newCheckedQuantity.push(checkedObj);
        } else {
            newChecked.splice(currentIndex, 1);
            newCheckedQuantity.splice(currentIndex, 1);
        }
        

        setChecked(newChecked);
        setCheckedQuantity(newCheckedQuantity);
        console.log(newChecked);
        console.log(newCheckedQuantity);
    };

    const konwertToCSV = () => {
        fetchData({"checked":checkedQuantity, "all":duplicates_list});
    }

    const fetchData = (data: any) => {
        fetch(`${host.server_host}/eantocsv/konwertcsv`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then((response: any) => response.json())
        .then((responseJson: any) => {
            console.log(responseJson)
            copyToClipboard(responseJson[0])
            setNewList(responseJson[1])
        })
        .then(() => setOpen(true))
        .catch(error => console.log(error))
    }

    const copyToClipboard = (str:string) => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      };

    const checkAll = () => {
        const newChecked = [...checked]
        const newCheckedQuantity = [...checkedQuantity]
        Object.keys(duplicates_list).map((instance: any, key: number) => {
            let quantity = duplicates_list[instance]['quantity']
            Object.keys(duplicates_list[instance]).map((item: any, index: number) => {
                if(item != "quantity" && index == 0){
                    let checkedObj = {
                        "id": item,
                        "quantity": quantity
                    }
                    newChecked.push(item)
                    newCheckedQuantity.push(checkedObj)
                }
            }) 
        })
        setChecked(newChecked)
        setCheckedQuantity(newCheckedQuantity)
    }

    let list = Object.keys(duplicates_list).map((instance: any, key: number) => {
        let length = Object.keys(duplicates_list[instance]).length
        return (
            <div key={key} style={length > 2 || length == 1 ? {backgroundColor: "#e55"} : key % 2 != 0 ? {backgroundColor: "#ccc"} : {backgroundColor: "white"}}>
                <ListItem>
                    Kod kreskowy produktu: &nbsp;
                    <ListItemText primary={instance} />
                    <p>{duplicates_list[instance]['quantity']}</p>
                    <ExpandMore />
                </ListItem>
                <Collapse in={true} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <RadioList
                            style={length > 2 || length == 1 ? {backgroundColor: "#e55"} : key % 2 != 0 ? {backgroundColor: "#ccc"} : {backgroundColor: "white"}}
                            duplicates_list_instance={duplicates_list[instance]}
                            handleToggle={(value: any, quantity: number) => handleToggle(value, quantity)}
                            checked={checked} />
                    </List>
                </Collapse>
            </div>
        )
    })

    return (
        <List
            component="nav"
            aria-labelledby="nested-list-subheader"
            subheader={
                <ListSubheader component="div" id="nested-list-subheader">
                    Wybierz pasujące produkty
                </ListSubheader>
            }
            className={classes.root}
        >
            <Button 
                color="secondary" 
                style={{float: 'right'}} 
                onClick={checkAll}
                disabled={Object.keys(duplicates_list).length > 0 ? false : true}
                >
                Zaznacz wszystko
            </Button>
            {list}
            <Button 
                style={{float: 'right'}} 
                variant="contained" 
                color="primary" 
                disabled={Object.keys(duplicates_list).length > 0 ? false : true}
                onClick={() => konwertToCSV()}
                >
                Kopiuj zaznaczone produkty
            </Button>
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={16000}
                onClose={handleClose}
                message="Skopiowano do schowka!"
                action={
                    <React.Fragment>
                        <Button color="secondary" size="small" onClick={() => props.setDuplicatesList(newList) }>
                            Pokaż nieskopiowane elementy listy
                        </Button>
                        <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </React.Fragment>
                }
            />
        </List>
    );
}