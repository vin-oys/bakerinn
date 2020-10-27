import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import Register from "../../Components/LoginPage/Register"

export default class RegisterPage extends Component {
    render() {
        return (
            <div className="login-page-box">
                <div className="login-box">
                    <h3>Register</h3>
                    <Register />
                </div>
                <div className="login-box">
                    <p>Already have an account?</p>
                    <button><Link to="/login">Log In</Link></button>
                </div>
            </div>
        )
    }
}



