

import { useRef, useState, useEffect } from "react";
import axios from 'axios';

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

    const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          const response = await axios.post('http://localhost:3308/register', {
            username: user,
            password: pwd
          });
      
          setSuccess(true);
          setUser('');
          setPwd('');
          setMatchPwd('');
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
            <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="username">
                    Username:
                </label>
                <input
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
                <p id="uidnote" className={userFocus && user && !validName ? "instructions" : "offscreen"} >

                    | USERNAME REQUIREMENTS | <br />
                    | 4 to 24 Characters |  <br/>
                    | Must begin with a letter |  <br />
                    | Letters, Numbers, Underscores and hyphens allowed | 
                </p>

                <label htmlFor="password">
                    Password:
                </label>
                <input
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
                <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                    | PASSWORD REQUIREMENTS | <br />
                    | 8 to 24 characters |<br />
                    | Must include uppercase and lowercase letters, a number and a special character |<br />
                    | Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">% |</span>
                </p>


                <label htmlFor="confirm_pwd">
                    Confirm Password:
                </label>
                <input
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
                <p id="confirmnote" className={!validMatch ? "instructions" : "offscreen"}>
                   | Must match the first password input field. |
                </p>

                <button disabled={!validName || !validPwd || !validMatch ? true : false}>Sign Up</button>
                
            </form>
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
