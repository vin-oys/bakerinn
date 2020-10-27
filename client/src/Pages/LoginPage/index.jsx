import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Login from "../../Components/LoginPage/Login"
import './index.css'

export default class LoginPage extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="login-page-box">
                <div className="login-box">
                    <h3>Login</h3>
                    <Login loggedIn={this.props.loggedIn} />
                </div>
                <div className="login-box">
                    <p>Dont have an account? </p>
                    <button><Link to="/signup">Sign Up</Link></button>
                </div>
            </div>
        )
    }
}
