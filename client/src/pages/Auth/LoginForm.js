import React, { useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { Container} from '../../components/Grid';
import { Card } from '../../components/Card';
import { Input, FormBtn } from '../../components/Form';
import Jumbotron from "../../components/Jumbotron/Jumbotron"
import Axios from 'axios';
import "./Login.css"
// import Navbar from "../../components/Nav/Nav.js"
//import bgIMG from "./bgIMG.jpg"
// import M4S from "./M4S.png";

function LoginForm({login}) {
  const [userObject, setUserObject] = useState({
    username: '',
    password: ''
  });
  const [redirectTo, setRedirectTo] = useState(null);

	const handleChange = (event) => {
		setUserObject({
      ...userObject,
			[event.target.name]: event.target.value
		});
  };
  
  const googleDirect = (event) =>{
    event.preventDefault();
    Axios.get("/auth/google")
  }

  const githubDirect =(event) => {
    event.preventDefault();
    Axios.get("/auth/github")
  }

	const handleSubmit = (event) => {
		event.preventDefault();
		login(userObject.username, userObject.password);
		setRedirectTo('/welcome');
	};

  if (redirectTo) {
    return <Redirect to={{ pathname: redirectTo }} />
  } else {
    return (
      <>
      {/* <Navbar /> */}
      <Jumbotron>
      <h2 className="display-4">Miles 4 Smiles </h2>
      <hr></hr>
      <h3>Run to support your local business!</h3>
      </Jumbotron>
         <Container>
            <Card title="Login to Miles 4 Smiles">
              <form style={{marginTop: 10}}>
                <label htmlFor="username">Username: </label>
                <Input
                  type="text"
                  name="username"
                  value={userObject.username}
                  onChange={handleChange}
                />
                <label htmlFor="password">Password: </label>
                <Input
                  type="password"
                  name="password"
                  value={userObject.password}
                  onChange={handleChange}
                />
                <Link to="/signup" className="btn registerBtn">Register</Link>
                <button onClick={googleDirect} className="btn btn-info ml-2"><i className="fa fa-google mr-2"></i>Sign in with Google</button>
                <button onClick={githubDirect} className="btn btn-dark ml-2"><i className="fa fa-github mr-2"></i>Sign in with Github</button>

                <FormBtn onClick={handleSubmit} style={{backgroundColor: "#89b0ae"}}>Login</FormBtn>
              </form>
            </Card>
      </Container>
      </>
    )
  }
}

export default LoginForm;
