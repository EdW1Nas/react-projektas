import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
function Dashboard() {


const [message, setMessage] = useState('');
const navigate = useNavigate();
const [workouts, setWorkouts] = useState([]);


useEffect(() => {
    axios.get('http://localhost:3001/dashboard', { withCredentials: true })
      .then(res => setMessage(res.data.message))
      .catch(() => navigate('/login'));
  

  axios.get('http://localhost:3001/workouts', { withCredentials: true })
  .then(res => setWorkouts(res.data))
  .catch(() => navigate('/login'));
  }, []);

  
  const handleLogout = async() => {
    try{
      await axios.post('http://localhost:3001/logout', {}, {
        withCredentials: true
      });

      navigate('/login');
    }
    catch (err){
      console.error('logout faild', err);
    }


  }
  return (
    <section>
      <GlobalStyle />
      <Title>User Dashboard</Title>
      <p>{message}</p>

      <Title>Your Workouts</Title>
      {workouts.length === 0 ? (
        <p>No workouts assigned yet.</p>
      ) : (
        <Table>
          <thead>
            <tr>
              <th>Name</th><th>Description</th><th>Type</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w.id}>
                <Td>{w.name}</Td>
                <Td>{w.description}</Td>
                <Td>{w.type}</Td>
                <Td>{w.date?.slice(0, 10)}</Td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <BackButton onClick={handleLogout}>Logout</BackButton>
    </section>
  );
}

export default Dashboard;

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

const Title = styled.h2`
  font-size: 2rem;
  color: white;
  margin-bottom: 10px;
`;

const Table = styled.table`
  border-collapse: collapse;
  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;

`;


const Td = styled.td`
  padding: 16px 64px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  
  `;

  const BackButton = styled(Link)`
  position: absolute;
  top: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.3);
  padding: 10px 15px;
  border-radius: 8px;
  color: white;
  font-size: 1rem;
  transition: background 0.3s;
  text-decoration: none;

  &:hover {
    background: rgba(255, 255, 255, 0.5);
  }
`;