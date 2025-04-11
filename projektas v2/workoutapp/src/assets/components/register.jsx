import { useRef, useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const USER_REGEX = /^[a-zA-Z][a-zA-Z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

const Register = () => {

    const userRef = useRef();
    const errRef = useRef();

    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false); 

    const navigate = useNavigate();

    useEffect(() => {
        userRef.current.focus()


    }, [])

    useEffect(() => {
        const result = USER_REGEX.test(user);
        console.log(result);
        console.log(user);
        setValidName(result);

    }, [user])

    useEffect(() => {
        const result = PWD_REGEX.test(pwd);
        console.log(result);
        console.log(pwd);
        setValidPwd(result);
        const match = pwd === matchPwd;
        setValidMatch(match);

    }, [pwd, matchPwd])


    useEffect(() => {
        setErrMsg('');

    }, [user, pwd, matchPwd])


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
    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.post('http://localhost:3001/register', {
            username: user,
            password: pwd
          });
      
          setSuccess(true);
          setUser('');
          setPwd('');
          setMatchPwd('');
          setTimeout(() => handleLogin(e), 500);
        } catch (err) {
          if (!err?.response) {
            setErrMsg("server error");
          } else if (err.response?.status === 409) {
            setErrMsg("username taken");
          } else {
            setErrMsg("register failed");
          }
          errRef.current.focus();
        }
      };

    return (

        <section>
          <GlobalStyle />
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <Title>Register</Title>
            <RegisterForm onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                </label>
                <Input
                    type="text"
                    id="username"
                    ref={userRef}
                    autoComplete="off"
                    onChange={(e) => setUser(e.target.value)}
                    required
                    aria-invalid={validName ? "false" : "true"}
                    aria-describedby="uidnote"
                    onFocus={() => setUserFocus(true)}
                    onBlur={() => setUserFocus(false)}

                    />
                <RequirementNote id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"} >

                    - 4 to 24 Characters<br/>
                    - Must begin with a letter<br />
                    - Letters, Numbers, Underscores and hyphens allowed
                </RequirementNote>

                <label htmlFor="password">
                    Password:
                </label>
                <Input
                    type="password"
                    id="password"
                    onChange={(e) => setPwd(e.target.value)}
                    value={pwd}
                    required
                    aria-invalid={validPwd ? "false" : "true"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                />
                <RequirementNote id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>

                    - 8 to 24 characters<br />
                    - Must include uppercase and lowercase letters, a number and a special character<br />
                    - Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                </RequirementNote>


                <label htmlFor="confirm_pwd">
                    Confirm Password:
                </label>
                <Input
                    type="password"
                    id="confirm_pwd"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    value={matchPwd}
                    required
                    aria-invalid={validMatch ? "false" : "true"}
                    aria-describedby="confirmnote"
                    onFocus={() => setMatchFocus(true)}
                    onBlur={() => setMatchFocus(false)}
                />
                <RequirementNote id="confirmnote" className={!validMatch ? "instructions" : "offscreen"}>
                   Must match the first password input field.
                </RequirementNote>

                <Button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</Button>
                
            </RegisterForm>
            <p>
                Already registered?<br />
                <span className="line">
                    
                    <a href="/login">Sign In</a>
                </span>
            </p>
        </section>



    )




}

export default Register

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

const RegisterForm = styled.form`
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

export const RequirementNote = styled.p`
  background-color: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 12px;
  margin-top: 5px;
  margin-bottom: 15px;
  font-size: 0.85rem;
  color: white;
  line-height: 1.5;
  border-radius: 10px;
  text-align: left;

  &.offscreen {
    display: none;
  }

  span {
    font-weight: bold;
    color: #bbb;
  }
`;