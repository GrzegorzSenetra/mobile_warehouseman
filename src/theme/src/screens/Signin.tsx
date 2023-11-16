import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
//import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import Copyright from '../components/Copyright';
import { useScrollTrigger } from '@material-ui/core';
import { connect } from 'react-redux';
import { login } from '../store/actions/actions';
import { matchPath, Redirect, useHistory } from 'react-router';
import { Link } from 'react-router-dom';

const useStyles = makeStyles((theme: any) => ({
  root: {
    height: '100vh',
  },
  image: {
    backgroundImage: 'url(./metalzbyt-logo-blue.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundColor:
      theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  paper: {
    margin: theme.spacing(8, 4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

interface IProps {
  userDispatch: any,
  history: any
}
interface IState {
  user: {
    username: string,
    password: string
  }
}

class SignIn extends React.Component<IProps, IState> {
  constructor(props: any){
    super(props);
    this.state = {
      user: {
        username: '',
        password: ''
      }
    }
  }

  _login = async (data:any) => {
    try {
        const response = await fetch(`/account/login`, {
            method: 'POST',
            headers: new Headers({
                'Accept': "application/json",
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });
        return new Promise((resolve,reject) => {
            if(response.ok) {
                resolve(response);
            } else {
                reject(new Error("Błąd Logowania! Błędne dane lub użytkownik nie został zatwierdzony przez administratora"));
            }
        });
    }
    catch (error) {
        console.error(error);
    }
  }

  login = () => {
    let user = {
      ...this.state.user,
      webtoken: this.generateToken(this.state.user)
    }
    console.log(user);
    this._login(user)
      .then((response: any) => response.json())
      .then((responseJson: any) => {
        localStorage.setItem('user', responseJson); // wrzucenie usera do sesji
        this.props.userDispatch(responseJson); // wrzucenie usera do stanu aplikacji w store
        localStorage.setItem('username', responseJson.username);
        sessionStorage.setItem('username', responseJson.username);
      })
      .then(() => {
        console.log(localStorage.getItem('user') ? true : false);
        window.location.replace("/");
        // this.props.history.push("/");
      })
      .catch(error => {
        alert("Błędne dane logowania!");
      })
  }

  generateToken = (data:any) => {
    let jwt = require('jsonwebtoken');
    let token = jwt.sign(data, 'dupa');
    return token;
  }

  render(){
    return <Render component={this} />;
  }
}

function Render(props: any){
    const classes = useStyles();
    const component = props.component;
    const history = useHistory();
    return (
      <Grid container component="main" className={classes.root}>
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Zaloguj się
            </Typography>
            <form className={classes.form}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Login"
                name="username"
                autoComplete="username"
                autoFocus
                value={component.state.user.email}
                onChange={(event: any) => component.setState({ user: {...component.state.user, username: event.target.value} })}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Hasło"
                type="password"
                id="password"
                autoComplete="current-password"
                value={component.state.user.password}
                onChange={(event: any) => component.setState({ user: {...component.state.user, password: event.target.value} })}
              />
              <Button
                //type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={component.login}
              >
                Zaloguj
                </Button>
              <Box mt={5}>
                <Copyright />
              </Box>
            </form>
          </div>
        </Grid>
      </Grid>
    );
  }



const mapStateToProps = (state: any) => {
  return {
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    userDispatch: (user: any) => dispatch(login(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);