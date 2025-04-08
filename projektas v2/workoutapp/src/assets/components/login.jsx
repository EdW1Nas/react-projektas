import { useRef, useState, useEffect } from "react";
import axios from 'axios';

const Login = () => {



    const [user, setUser] = useState('');
    const [pwd, setPwd] = useState(''); 
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false); 


    useEffect(() => {
        setErrMsg('');

    }, [user, pwd])
    
    const handleLogin = async (e) => {
        e.preventDefault();
        // pridet logina veliau
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

            

        </section>

    )



}

export default Login