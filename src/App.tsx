import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Primary from './Primary';
import Navbar from './Navbar';

type State = {
  loggedIn: boolean
}

class App extends React.Component<any, State> {
  constructor(props: any) {
    super(props)
    this.state = {
      loggedIn: false
    }
  }
  render() {
    return (<div className="container">
      <BrowserRouter>
        <Navbar
          loggedIn={this.state.loggedIn}
          registerClicked={this.registerClicked}
          logInClicked={this.logInClicked}
          logOutClicked={this.logOutClicked} />

        <Route path="/" exact component={Primary} />
      </BrowserRouter>
    </div>)
  }

  registerClicked = () => {
  }

  logInClicked = () => {
    this.setState({
      loggedIn: true
    })
  }

  logOutClicked = () => {
    this.setState({
      loggedIn: false
    })
  }
}

export default App
