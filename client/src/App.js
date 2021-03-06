import React, { useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import LoginForm from './pages/Auth/LoginForm';
import SignupForm from './pages/Auth/SignupForm';
import Welcome from './pages/Welcome/Welcome';
import Dashboard from './pages/Dashboard';
import MyPage from './pages/MyPage/MyPage';
import Nav from './components/Nav';
import AUTH from './utils/AUTH';
import UserContext from './utils/UserContext';
import About from './pages/About/About';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  let history = useHistory();

  const logout = () => {
    // event.preventDefault();

    AUTH.logout().then((response) => {
      // check for logout status and redirect
      if (response.status === 200) {
        setLoggedIn(false);
        setUser(null);
        setRedirectTo('/');
        history.push('/');
      }
    });
  };

  const login = (username, password, result) => {
    AUTH.login(username, password)
      .then((response) => {
        if (response.status === 200) {
          // update the state
          setUser(response.data.user);
          setLoggedIn(true);
          //getting all users
          AUTH.getAllUsers().then((response) => {
            if (!response.data.users) {
              setUsers(null);
            } else {
              setUsers(response.data.users);
            }
          });
          result(1);
        }
      })
      .catch((err) => {
        result(0);
      });
  };

  return (
    <div className="App">
      {loggedIn && (
        <div>
          <Nav user={user} logout={logout} />
          <div className="main-view">
            <Switch>
              <>
                <Route exact path="/welcome">
                  <UserContext.Provider value={{ user, users, setUser }}>
                    <Welcome />
                  </UserContext.Provider>
                </Route>
                <Route exact path="/about" component={About} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route exact path="/mypage/:id">
                  <UserContext.Provider value={{ user, users, setUser }}>
                    <MyPage logout={logout} />
                  </UserContext.Provider>
                </Route>
              </>
            </Switch>
          </div>
        </div>
      )}
      {!loggedIn && (
        <>
          <Nav login={login} />
          <div className="auth-wrapper">
            <Switch>
              <>
                <Route
                  exact
                  path="/"
                  component={() => (
                    <LoginForm login={login} user={user} logout={logout} />
                  )}
                />
                <Route
                  exact
                  path="/welcome"
                  component={() => <LoginForm login={login} />}
                />
                <Route exact path="/about" component={About} />
                <Route exact path="/dashboard" component={Dashboard} />
                <Route
                  exact
                  path="/mypage/:id"
                  component={() => <LoginForm login={login} />}
                />
                <Route exact path="/signup" component={SignupForm} />
              </>
            </Switch>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
