import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Login = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState(''); 
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);
    
    const navigate = useNavigate();


    useEffect(() => {
        setErrMsg('');

    }, [user, pwd])
    
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/login', {
                username: user,
                password: pwd
              },
              {
                withCredentials: true
              }
            );
        
            const role = response.data.role;
    console.log(response.data.message);

  

    if (role === 'Admin'){
      navigate ('/adminpanel')
    }
    else{
    navigate('/dashboard');
    }
  } 
    catch (err) {
    console.error(err);

    if (!err?.response) {
      setErrMsg("No server response");
    } else if (err.response.status === 401) {
      setErrMsg("Wrong username or password");
    } else {
      setErrMsg("Login failed");
    }

    errRef.current?.focus();
  }
};


    return (



        <section>


            
            <h1>Login</h1>
            <form onSubmit={handleLogin}>

            <label htmlFor="username">
                    Username:
                </label>
                <input
                type="text"
                id="username"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                />


            <label htmlFor="password">
                    Password:
                </label>
                <input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                />

                <button disabled={!user || !pwd}>Log In</button>






            </form>
            <p>
                Getting started?<br />
                <span className="line">
                    
                    <a href="/register">Register</a>
                </span>
            </p>

            

        </section>

    )



}

export default Login