import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Auth from '../../../Auth.js';
import './index.css'

const Login = (props) => {
    let history = useHistory();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isValid, setValid] = useState(true);
    const [error, setError] = useState('Try again')

    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== '' &&
            email !== '') {

            Auth.login(email, password, (isValid, err) => {
                if (isValid) {
                    setEmail('');
                    setPassword('');
                    // redirect to homepage

                    // remove error warnings
                    setValid(true)
                    // change navbar/ show chat
                    props.loggedIn()
                    // redirect to homepage
                    history.push('/homepage')
                } else {
                    // prompt user to try again with inline error msg
                    // temp alert for debugging
                    setError(err)
                    setValid(false)
                }
            })
        } else {
            setValid(false)
        }
    }

    return (
        <div className="form-box">
            <div className="login">
                <form onSubmit={handleSubmit}>
                    <div className="form-input">
                        <input type="email"
                            name="email"
                            value={email}
                            placeholder="Email"
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="form-input">
                        <input type="password"
                            name="password"
                            value={password}
                            placeholder="Password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div style={isValid
                        ? { visibility: 'hidden', margin: "10px 0" }
                        : { visibility: 'visible', color: "red", margin: "10px 0" }}>
                        {error}
                    </div>
                    <div className="form-input">
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div >
        </div>
    )
}

export default Login;