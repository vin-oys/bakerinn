import React from 'react';
import { Route, Redirect, BrowserRouter as Router, withRouter, Link } from "react-router-dom"
import './App.css';
import Login from "./Pages/LoginPage/"
import Register from "./Pages/RegisterPage/"
import NavBar from './Components/NavBar';
import DashboardPage from './Pages/DashboardPage';
import HomePage from './Pages/HomePage';
import SearchResults from './Pages/SearchResultsPage';
import Auth from './Auth';
import ProtectedRoute from './Components/ProtectedRoute';
import { Container } from 'react-bootstrap';
import Footer from './Components/Footer';
import Test from './Pages/TestPage';
import ChatContainer from './Components/ChatContainer';
import io from 'socket.io-client'
import SearchBar from './Components/SearchBar';
import Switch from 'react-bootstrap/esm/Switch';

require("dotenv").config();



class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loggedIn: false,
      socket: null,
      newChatData: null,
      username: null,
      userId: null,
      search: '',
      searchThis: null
    }
  }

  loggedIn = () => {
    this.setState({
      loggedIn: true
    })
  }

  // change state
  // close socket
  // delete all personalised content
  // remove token
  signout = () => {
    this.state.socket.close()
    console.log('user disconnected');
    this.setState({
      loggedIn: false,
      socket: null,
      username: null
    })

    fetch('/api/signout')
        .then(res=>res.text())
        .then(res=>{console.log(res)})
        .catch(err=>{console.log(err, "---err in signing out.")})
  }

  loggedIn = () => {
    const cookie = document.cookie
    const username = JSON.parse(atob(cookie.split(".")[1])).username
    const userId = JSON.parse(atob(cookie.split(".")[1])).userId

    let socket = this.setupSocket(username, userId)
    this.setState({
      loggedIn: true,
      socket: socket,
      username: username,
      userId: userId
    })
  }

  createChat = (data) => {
    this.setState({
      newChatData: data
    })
  }

  clearChatData = () => {
    this.setState({
      newChatData: null
    })
  }

  componentDidMount() {

    // check on first opening if the user has logged in before
    // authenticate the token
    Auth.authenticate()
      .then(valid => {
        if (valid) {
          const cookie = document.cookie
          const username = JSON.parse(atob(cookie.split(".")[1])).username
          const userId = JSON.parse(atob(cookie.split(".")[1])).userId

          let socket = this.setupSocket(username, userId)
          this.setState({
            loggedIn: valid,
            socket: socket,
            username: username,
            userId: userId
          })
        } else {
          this.setState({
            loggedIn: valid
          })
        }
      })
      .catch(err => console.log(err, '-- authenticate'))
  }

  // open socket only when authenticated and logged in
  // check when app opens
  // check when user logs in
  setupSocket = (username, userId) => {

    //query to send the username
    let socket;
    if (process.env.NODE_ENV === 'production') {
      socket = io({ query: `username=${username}` })
    } else {
      const ENDPOINT = process.env.PORT || "localhost:5000"
      socket = io(ENDPOINT, { query: `username=${username}` })
    }
    socket.on('connect', () => {
      console.log(username, 'connected');
    })

    socket.emit('join', { room_id: userId })

    return socket
  }


  handleChange = (e) => {
    this.setState({
      search: e.target.value,
    })
  }

  handleSearch = (e) => {
    if (e.keyCode === 13 && e.target.value !== '') {
      // console.log(this.state.search);
      let location = {
        pathname: '/search',
        search: `?q=${this.state.search}`
      }

      // this.props.history.push("/search?q=" + this.state.search)
      this.props.history.push(location)

      this.setState(prevState => ({
        searchThis: prevState.search
      }))

    }
  }

  render() {
    return (
      <div className="App">
        <div>
          <NavBar isLoggedIn={this.state.loggedIn}
            user={this.state.username}
            signout={this.signout} />

          <SearchBar onChange={this.handleChange}
            onKeyUp={this.handleSearch}
            value={this.state.search} />
        </div>



        {/* conditionally render chat-overlay, show only when logged in */}
        {this.state.loggedIn
          ? (<ChatContainer socket={this.state.socket}
            newChatData={this.state.newChatData}
            clearChatData={this.clearChatData} />)
          : null
        }


        <Container style={{ marginTop: '122px', textAlign: "center" }}>
          <Switch style={{ padding: "0" }}>
            <Route exact path="/search">
              <SearchResults searchInput={this.state.searchThis} />
            </Route>

            <Route exact path="/signup" component={Register} />

            <Route path="/login"
              exact
              component={() => <Login loggedIn={this.loggedIn} />} />

            {/* this route must protected */}
            <ProtectedRoute path="/dashboard">
              <DashboardPage user={this.state.username}/>
            </ProtectedRoute>

            {/* this route must have protected actions*/}
            <Route path="/homepage">
              <HomePage isLoggedIn={this.state.loggedIn}
                createChat={this.createChat} />
            </Route>

            {/* blank page for testing*/}
            {/* <Route exact path="/test">
              <Test listingId="5f670aebb063fffb5a0d183f" socket={this.state.socket} />
            </Route> */}

            {/* redirect all non-specified routes. maybe have a 404 page*/}
            <Route exact path="/">
              <Redirect to="/homepage" />
            </Route>
          </Switch>
          <Footer />
        </Container>
      </div>
    );
  }
}

export default withRouter(App);