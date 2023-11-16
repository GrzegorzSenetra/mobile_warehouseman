import { hot } from 'react-hot-loader/root';
import * as React from "react";
import { render } from "react-dom";
import { Provider } from 'react-redux';
import store from './store/store';

import Router_Component from './router';

interface IProps {
    props: any
}
interface IState {}

class App extends React.Component<IProps,IState> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
        <Provider store={store()}>
            <div>
                <Router_Component />
            </div>
        </Provider>
    );
  }
}

export default hot(App);

const container = document.getElementById("app");
render(<App props />, container);