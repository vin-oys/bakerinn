// handle all authentication and authorization here
// do the fetch calls and logic here


// we can add meaningful error msg from the server in the cb to prompt the user

const login = async (email, password, cb) => {
  const url = "/api/users/login";
  const request = {
    method: "POST",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  }
  try {
    const response = await fetch(url, request)
    const data = await response.text()
    if (response.status === 200){
      cb(true, null)
    } else {
      cb(false,data)
    }
  } catch (err) {
    cb(false, err)
  }
}

const register = async (email, username, password, cb) => {
  const url = "/api/users/new";
  const request = {
    method: "POST",
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, username, password })
  }
  try {
    const response = await fetch(url, request)
    const data = await response.text()
    if (response.status === 201){
      cb(true, null)
    } else {
      cb(false,data)
    }
  } catch (err) {
    cb(false, err)
  }
}

const authenticate = async (cb) => {
  const url = "/api"

  try {
    const response = await fetch(url)
    if (response.status === 200) {
      return true
    } else {
      console.log('bad response');
      return false
    }
  } catch (err) {
    console.log('err not authorized');
    return false
  }
}

const Auth = {
  login,
  register,
  authenticate
}

export default Auth