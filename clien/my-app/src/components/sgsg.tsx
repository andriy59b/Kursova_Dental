import React, {FC, useContext, useState} from 'react';
import './LoginSignup.css';
import {Context} from "../index";
import {observer} from "mobx-react-lite";

import userIcon from './Assets/person.png';
import emailIcon from './Assets/email.png';
import passwordIcon from './Assets/password.png';

const LoginSign = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const {store} = useContext(Context);


  return (
    <div className='container'>
      <div className='header'>
        <div className='text'>Sign Up</div>
        <div className='underline'></div>
      </div>
      <div className='inputs'>

        <div className='input'>
          <img src={emailIcon} alt='' />
          <input
            type='email'
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className='input'>
          <img src={passwordIcon} alt='' />
          <input
            type='password'
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </div>
      <div className='forgot-password'>
        Lost Password? <span>Click Here!</span>
      </div>
      <div className='submit-container'>
        <div className='submit' onClick={() => store.registration(email, password)}>
          Sign Up
        </div>
        <div className='submit' onClick={() => store.login(email, password)}>
          Login
        </div>
      </div>
    </div>
  );
};

export default LoginSign;
