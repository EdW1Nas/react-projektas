import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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
      <h1>User Dashboard</h1>
      <p>{message}</p>

      <h2>Your Workouts</h2>
      {workouts.length === 0 ? (
        <p>No workouts assigned yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th><th>Description</th><th>Type</th><th>Date</th>
            </tr>
          </thead>
          <tbody>
            {workouts.map((w) => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.description}</td>
                <td>{w.type}</td>
                <td>{w.date?.slice(0, 10)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={handleLogout}>Logout</button>
    </section>
  );
}

export default Dashboard;