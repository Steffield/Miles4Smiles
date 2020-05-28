import React, { useState, useEffect, useRef, useContext } from "react";
import { Link } from "react-router-dom";
import "./RunningStats.css"
import Jdenticon from "react-jdenticon";
import LineChart from "../LineChart";
import PieChart from "../PieChart";
import { Col, Row, Container } from "../Grid";
import { List, ListItem } from "../List";
import { Card } from "../Card";
import ChallengeContext from "../../utils/ChallengeContext";
import ChallengeModal from "../ChallengeModal/ChallengeModal";
import UpdateChallengeForm from "../UpdateChallenge/UpdateChallengeForm";
import DailyRunModal from "../DailyRunModal";
import API from "../../utils/API";
import UserContext from "../../utils/UserContext";

function RunningStats() {
  const { user } = useContext(UserContext);
  console.log("Context UserCard: ", user);
  // Setting our component's initial state
  const [runningStats, setRunningStats] = useState([]);
  const [challenges, setChallenges] = useState([]);
  
  // Load all RunningStats and store them with setRunningStats
  useEffect(() => {
    loadRunningStats();
    loadChallenges();
  }, []);

  // Loads all RunningStats and sets them to RunningStats
  function loadRunningStats() {
    API.getRunningStats()
      .then(res => {
        setRunningStats(res.data.runningStats);
      })
      .catch(err => console.log(err));
  };

  // Loads all Challenges and sets them to Challenges
  function loadChallenges() {
    API.getChallenges()
      .then(res => {
        console.log("My challenge ",res.data.challenges);
        const myChallenges = []; 
        res.data.challenges.map( challenge => {
          // Extracting the challenges started by or challenged to the current user
          if(challenge.challengers[0]===user.username || challenge.challengers[1]===user.username)
            myChallenges.push(challenge);
        });
        setChallenges(myChallenges);
      })
      .catch(err => console.log(err));
  };

  // Deletes a run from the database with a given id, then reloads RunningStats from the db
  function deleteRunningStat(id) {
    API.deleteRunningStat(id)
      .then(res => loadRunningStats())
      .catch(err => console.log(err));
  }

  let loggedInUser;
  if (user) {
    loggedInUser = { user }
  return(
    <>
      <Container fluid>
        <Row>
          <Col size="md-6 sm-12">
            <Card title="My Challenges">
              {challenges.length ? (
                <List>
                  { 
                  challenges.map(challenge => ( (challenge.challengers[0] === user.username) && (
                    <ListItem key={challenge._id}>
                      <Link to={"/challenge/" + challenge._id}>
                      <div className="card text-center">
                        <div className="card-body">
                          <h5 className="card-header">You Challenged {challenge.challengers[1]}</h5>
                          <p className="card-text">You challenged {challenge.challengers[1]} to do a {challenge.distance} miles run where the loser needs to donate ${challenge.donatedAmount} to {challenge.businessName}.</p>
                          <a href="#" className="btn accept mr-5" id="update-challenge" data-toggle="modal" data-target="#updateModal" >Enter Challenge Outcome</a>
                          <div className="modal fade" id="updateModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div className="modal-dialog" role="document">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title" id="exampleModalLabel">Complete & submit challenge details below:</h5>
                                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                  </button>
                                </div>
                                <div className="modal-body">
                                  <UpdateChallengeForm />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="card-footer text-muted">
                            Status: Pending
                        </div>
                      </div>
                      </Link>
                      {/* <DeleteBtn onClick={() => deleteRunningStat(runningStat._id)} /> */}
                    </ListItem>
                  )))}
                </List>
              ) : (
                // hardcoded until we can render, then we will write "No Challenges yet"
              
            <>
            
            <hr></hr>

            <div className="card text-center">
              <div className="card-body">
                <h5 className="card-header">You Were Challenged By Bob</h5>
                <p className="card-text">Bob challenges you to do a 3 mile race. The slower runner donates $10 per mile to Bob's Burger.</p>
                <a href="#" className="btn accept mr-5">Accept Challenge</a><a href="#" className="btn deny">Deny Challenge</a>
              </div>
              <div className="card-footer text-muted">
                  2 days ago
              </div>
            </div>
       
            
            </>
     
              )}
            </Card>
          </Col>
            
          <Col size="md-6">
        
            <Card title="Update Your Information" style={{justifyContent:"center"}}>
              
              {/* <DailyRunModal />
              <ChallengeModal /> */}
                  
              <div key= {user._id} className="card text-center">
              <div className="card-header text-center">
                    <DailyRunModal />
                    <ChallengeContext.Provider value={{ challenges }}>
                      <ChallengeModal />
                    </ChallengeContext.Provider>
                  </div>
                <div className="card-body ">
                  <Jdenticon className="avatar" size="48" value={user._id} float="right"></Jdenticon>
                  <h5 className="card-title justify-content-center">{user.username}</h5>
                  <h6 className="card-subtitle mb-2 text-muted"><i className="fa fa-location"></i>{user.city}, {user.state}</h6>
                  <hr></hr>
                  <p className="card-text pace">Average mile pace: {user.averagePace}</p>
                  <p className="card-text distance">Preferred distance: {user.averageDistance}</p>
                  <hr></hr>
                  <button className="btn card-link updateBtn"><i className="fa fa-edit mr-2"></i>Update</button>
                  <button className="btn btn-light card-link deleteBtn ml-3"><i className="fa fa-trash mr-2"></i>Delete</button>
                </div>
              </div>                
            </Card>
            
          </Col>
          </Row>
          
          <Row>
          <Col size="md-6 sm-12">
            <Card title="My Ran Races">
              { (runningStats.length) ? (<LineChart />) : <h3>No Run recorded!</h3>
              }
              
              {/* {runningStats.length ? (
                <List>
                  {runningStats.map(runningStat => (
                    <Link to={"/runningStats/" + runningStat._id}>
                        <p>Pace: {runningStat.pace} minutes</p>
                    <DeleteBtn onClick={() => deleteRunningStat(runningStat._id)} />
                    </ListItem>
                  ))}
                </List>
              )  */}
            </Card>
            </Col>
            
            <Col size="md-6 sm-12">
            <Card title="Past Challenges">
              <PieChart />
              
            </Card>
            
            </Col>
          </Row>
      </Container>
      </>
    );
  } else {
    loggedInUser = "Loading..."
  }
  return <div>{loggedInUser}</div>
}

export default RunningStats;
