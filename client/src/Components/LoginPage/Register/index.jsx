import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import Auth from '../../../Auth';

const Register = () => {
    let history = useHistory()

    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isValid, setValid] = useState(true);
    const [error, setError] = useState('Try again')

    const handleSubmit = (e) => {
        e.preventDefault();
        if (email !== '' &&
            password !== '' &&
            username !== '') {

            Auth.register(email, username, password, (isValid, err) => {
                if (isValid) {
                    setEmail('');
                    setPassword('');
                    setUsername('');
                    // redirect to homepage
                    setValid(true)
                    history.push('/login')
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
                        <input type="text"
                            name="username"
                            value={username}
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)} />
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
                        <button type="submit">Register</button>
                    </div>
                </form>
            </div >
        </div>
    )
}

export default Register;