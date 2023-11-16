import * as React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import Badge from '@material-ui/core/Badge';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
//import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Copyright from '../../components/Copyright';
import { ExitToApp } from '@material-ui/icons';
import { Link, NavLink, Route, Router, Switch, useHistory, useRouteMatch } from 'react-router-dom';
import { login } from '../../store/actions/actions';
import { connect } from 'react-redux';
import { Avatar } from '@material-ui/core';
import { deepPurple } from '@material-ui/core/colors';

// Komponenty programow
import Main from '../../../modules/supermagazynier/web/screens/main';
import SuperComparer from '../../../modules/supercomparer/web';
import EanToCsv from '../../../modules/eantocsv/web';
import VatComparer from '../../../modules/vatcomparer/web'
import WinienimaComparer from '../../../modules/winienima/web';
import InventoryTurnOverRatioCalculator from '../../../modules/inventoryturnoverratio/web';
import LabelCreator from '../../../modules/supermagazynier/web/modules/Documents/components/LabelCreator';
import Allegrofv from '../../../modules/allegrofv/web';
import PlanCreator from '../../../modules/plancreator/web';

const drawerWidth = 240;

const useStyles = makeStyles((theme: any) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    paddingRight: 24, // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  menuButtonHidden: {
    display: 'none',
  },
  title: {
    flexGrow: 1,
  },
  drawerPaper: {
    position: 'relative',
    whiteSpace: 'nowrap',
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerPaperClose: {
    overflowX: 'hidden',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: theme.spacing(7),
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9),
    },
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto',
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240,
  },
  orange: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

function Dashboard(props: any) {
  const classes = useStyles();
  let { path, url } = useRouteMatch();
  const [open, setOpen] = React.useState(true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleDrawerClose = () => {
    setOpen(false);
  };
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="absolute" className={clsx(classes.appBar, open && classes.appBarShift)} style={{backgroundColor: '#fe7d14'}}>
        <Toolbar className={classes.toolbar}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            className={clsx(classes.menuButton, open && classes.menuButtonHidden)}
          >
            <MenuIcon />
          </IconButton>
          <Typography component="h1" variant="h6" color="inherit" noWrap className={classes.title}>
            Metalzbyt Panel
          </Typography>
          <div>
            <Avatar className={classes.orange}>{localStorage.getItem('username')[0]+localStorage.getItem('username')[2].toUpperCase()}</Avatar>
          </div>
          <Link to="/sign_in" style={{color: "white"}}>
            <IconButton color="inherit" onClick={() => {
                localStorage.removeItem('user');
                props.userDispatch({});
              }}>
              <Badge color="secondary">
                <ExitToApp />
              </Badge>
            </IconButton>
          </Link>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        classes={{
          paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
        }}
        open={open}
      >
        <div className={classes.toolbarIcon}>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List>{mainListItems}</List>
        <Divider />
        <List>{secondaryListItems}</List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="lg" className={classes.container}>
            <Switch>
              <Route path={`/supermagazynier`}>
                <Main />
              </Route>
              <Route path={`/supercomparer`}>
                <SuperComparer />
              </Route>
              <Route path={`/eantocsv`}>
                <EanToCsv />
              </Route>
              <Route path={`/vatcomparer`}>
                <VatComparer />
              </Route>
              <Route path={`/winienima`}>
                <WinienimaComparer />
              </Route>
              <Route path={`/inventoryturnoverratiocalculator`}>
                <InventoryTurnOverRatioCalculator />
              </Route>
              <Route path={`/label_creator`}>
                <LabelCreator />
              </Route>
              <Route path={`/allegro_fv`}>
                <Allegrofv />
              </Route>
              <Route path={`/plancreator`}>
                <PlanCreator />
              </Route>
            </Switch>
          <Box pt={4}>
            <Copyright />
          </Box>
        </Container>
      </main>
      
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    userDispatch: (user: any) => dispatch(login(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);