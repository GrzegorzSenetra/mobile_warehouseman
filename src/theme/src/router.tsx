import * as React from "react";
import {
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Router } from 'react-router';
import { createBrowserHistory } from 'history';
import createHistory from 'history/createBrowserHistory';
import { connect } from "react-redux";

// VIEWS
import SignIn from './screens/Signin';
import Dashboard from './screens/dashboard/Dashboard';
import Main from '../modules/supermagazynier/web/screens/main';


interface IProps {
  user: any
}
interface IState {
  auth: boolean
}
const history = createHistory();


class Router_Component extends React.Component<IProps, IState> {
  constructor(props: any){
    super(props);
    this.state = {
      auth: (Object.keys(this.props.user).length === 0 && this.props.user.constructor === Object) || localStorage.getItem('user') ? true : false
    }
  }

  render() {
    return (
      <Router history={history}>
        <div>
          {/* A <Switch> looks through its children <Route>s and
              renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/sign_in">
              <SignIn history={history} />
            </Route>
            <PrivateRoute
              path="/"
              component={Dashboard}
              isAuthenticated={this.state.auth}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}

const PrivateRoute = ({ component: Component, isAuthenticated, ...rest }:any) => {
  return (<Route {...rest} render={(props) => (
      isAuthenticated === true
      ? <Component {...props} />
      : <Redirect to="/sign_in"/>
  )} />
  );
};

const mapStateToProps = (state: any) => {
  return {
    user: state.user
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Router_Component);