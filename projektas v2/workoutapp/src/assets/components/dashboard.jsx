import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Dashboard() {


const [message, setMessage] = useState('');
const navigate = useNavigate();

useEffect(() => {
    axios.get('http://localhost:3001/dashboard', { withCredentials: true })
      .then(res => setMessage(res.data.message))
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
        <h1> User Dashboard</h1>
        <p>{message}</p>
        <button onClick={handleLogout}>Logout</button>
    </section>
  )

}

export default Dashboard;