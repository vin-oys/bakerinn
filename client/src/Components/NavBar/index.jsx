import React, { Component } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { Link, withRouter } from 'react-router-dom';
import "./index.css"
import {ReactComponent as SuperImportant} from '../../sourdough.svg';

class NavBar extends Component {
  constructor(props) {
    super(props)
  }

  signout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC;"
    this.props.signout()
    this.props.history.push('/homepage')
  }

  render() {
    let { isLoggedIn } = this.props;

    return (

      <div className="nav-header">
          <Link to='/homepage'>
            <img className="logo" src="https://i.imgur.com/3RsoWX2t.png?2" alt="" />
          </Link>

          {isLoggedIn
            ? (<nav style={{flexGrow: 2}}>
              <ul className="nav-links">
                <li><Link className="nav-items" to='/homepage'>Homepage</Link></li>
                <li><Link className="nav-items" to='/dashboard'>Dashboard</Link></li>
              </ul>
            </nav>
            )
            : <span className="nav-text">Keep calm and bake</span>}

          {isLoggedIn
            ? (<div style={{display: "flex", alignItems: "center"}}>
                <span className="nav-textLogin">Hi! <strong>{this.props.user}</strong></span>
                <button className="nav-button" onClick={this.signout}>Sign out</button> 
              </div>)
            : (<Link to="/login"><button className="nav-button">Log In</button></Link>)}
      </div>
    )
  }
}

export default withRouter(NavBar);

