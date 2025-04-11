import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

const AdminWorkouts = () => {
const [workouts, setWorkouts] = useState ([]);
const [users, setUsers] = useState ([]);
const [editingWorkout, setEditingWorkout] = useState(null);
const navigate = useNavigate();
const [newWorkout, setNewWorkout] = useState({
    name: "",
    description: "",
    type: "",
    date: "",
    user_id: "",
});

useEffect(() => {
    axios.get("http://localhost:3001/workouts", { withCredentials: true })
      .then((res) => {
        setWorkouts(res.data);
  
        return axios.get("http://localhost:3001/users", { withCredentials: true });
      })
      .then((res) => setUsers(res.data))
      .catch(err => {
        if (err.response?.status === 403 || err.response?.status === 401) {
          navigate('/dashboard');
        }
      });
  }, []);


  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      if (editingWorkout) {
        await axios.put(`http://localhost:3001/workouts/${editingWorkout}`, newWorkout, { withCredentials: true });
      } else {
        await axios.post("http://localhost:3001/workouts", newWorkout, { withCredentials: true });
      }
      setEditingWorkout(null);
      window.location.reload();
    } catch (err) {
      console.error("failed to save workout", err);
    }
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout.id);
    setNewWorkout({
      name: workout.name,
      description: workout.description,
      type: workout.type,
      //date: workout.date.split('T')[0],
      date: workout.date?.slice(0, 10),

      user_id: workout.user_id,
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/workouts/${id}`, { withCredentials: true });
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (err) {
      console.error("failed to delete workout", err);
    }
  };

  const backToPanel = async() => {
    navigate('/adminpanel');
  }

  return (
    <section>
      <Title>Admin Workout Manager</Title>

      <form onSubmit={handleAdd}>
        <Input type="text" placeholder="Workout name" required
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
        />
        <Input type="text" placeholder="Description"
          value={newWorkout.description}
          onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
        />
        <Input type="text" placeholder="Type"
          value={newWorkout.type}
          onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
        />
        <Input type="date"
          value={newWorkout.date}
          onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
        />
        <Select required
          value={newWorkout.user_id}
          onChange={(e) => setNewWorkout({ ...newWorkout, user_id: e.target.value })}
        >
          <option value="">Assign To User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </Select>
        <Button type="submit">{editingWorkout ? "Update Workout" : "Add Workout"}</Button>
        <BackButton onClick={backToPanel}>Back to Admin Panel</BackButton>
        {editingWorkout && (
    <Button
      type="button"
      onClick={() => {
        setEditingWorkout(null);
        setNewWorkout({
          name: "",
          description: "",
          type: "",
          date: "",
          user_id: "",
        });
      }}
    >
      Cancel Edit
    </Button>
    
  )}
</form>
  <GlobalStyle />
      <Table>
        <thead>
          <tr>
            <th>Name</th><th>User</th><th>Description</th><th>Type</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((w) => (
            <tr key={w.id}>
              <Td>{w.name}</Td>
              <Td>{w.user_name}</Td>
              <Td>{w.description}</Td>
              <Td>{w.type}</Td>
              <Td>{w.date?.slice(0, 10)}</Td>
              <Td>
                <Button onClick={() => handleEdit(w)}>Edit</Button>
                <Button onClick={() => handleDelete(w.id)}>Delete</Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </section>
  );
};

export default AdminWorkouts;

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
  
    const BackButton = styled.button`
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
  margin: 6px;

`;



export const Select = styled.select`
  background: #6a11cb;
  color: white;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 1rem;
  border: none;
  outline: none;
  cursor: pointer;
  appearance: none; 

  &:hover {
    background: #7644c9;
  }

  &:focus {
    outline: 2px solid #a484f2;
  }
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
  margin: 6px;
`;