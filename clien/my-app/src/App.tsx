import React, {FC, useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import LoginSignup from "./components/LoginSignup";
import LoginSign from "./components/sgsg";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/UserService";
import './App.css';

const App: FC = () => {
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
        
    }, [])


    if (store.isLoading) {
        return <div>Загрузка...</div>
    }
  


    if (!store.isAuth) {
      return (
          <div>
              <LoginSign/>
          </div>
      );
  }
    

    return (
        <div>
            <h1>{store.isAuth ? `User authorization ${store.user.email}` : 'АВТОРИЗУЙТЕСЬ'}</h1>
            <h1>{store.user.isActivated ? 'Аккаунт підтверджений' : 'ПІДТВЕРДІТЬ АККАУНТ!!!!'}</h1>
            <button onClick={() => store.logout()}>ВИЙТИ</button>
            {users.map(user =>
                <div key={user.email}>{user.email}</div>
            )}
        </div>
    );
};

export default observer(App);
