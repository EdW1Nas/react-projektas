import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

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

        <GlobalStyle />
            
            <Title>Login</Title>
            <LoginForm onSubmit={handleLogin}>

            <label htmlFor="username">
                    Username:
                </label>
                <Input
                type="text"
                id="username"
                onChange={(e) => setUser(e.target.value)}
                value={user}
                required
                />


            <label htmlFor="password">
                    Password:
                </label>
                <Input
                type="password"
                id="password"
                onChange={(e) => setPwd(e.target.value)}
                value={pwd}
                required
                />

                <Button disabled={!user || !pwd}>Log In</Button>






            </LoginForm>
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

const GlobalStyle = createGlobalStyle`
  html, body {
    height: 100%;
    margin: 0;
    padding: 0;
    background: linear-gradient(to right, #6a11cb, #331652);
    font-family: sans-serif;
    color: white;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: rgba(255, 255, 255, 0.2);
  padding: 40px;
  border-radius: 15px;
  text-align: center;
  width: 300px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 12px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  outline: none;
  text-align: center;
`;

const Button = styled.button`
  background: #6a11cb;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  border: none;
  outline: none;

   &:disabled {
    background: #301934;
    color: #667;
    cursor: not-allowed;
  }
`;

