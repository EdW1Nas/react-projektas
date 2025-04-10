import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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
      date: workout.date.split('T')[0],
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
      <h1>Admin Workout Manager</h1>

      <form onSubmit={handleAdd}>
        <input type="text" placeholder="Workout name" required
          value={newWorkout.name}
          onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
        />
        <input type="text" placeholder="Description"
          value={newWorkout.description}
          onChange={(e) => setNewWorkout({ ...newWorkout, description: e.target.value })}
        />
        <input type="text" placeholder="Type"
          value={newWorkout.type}
          onChange={(e) => setNewWorkout({ ...newWorkout, type: e.target.value })}
        />
        <input type="date"
          value={newWorkout.date}
          onChange={(e) => setNewWorkout({ ...newWorkout, date: e.target.value })}
        />
        <select required
          value={newWorkout.user_id}
          onChange={(e) => setNewWorkout({ ...newWorkout, user_id: e.target.value })}
        >
          <option value="">Assign to user...</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>{u.name}</option>
          ))}
        </select>
        <button type="submit">{editingWorkout ? "Update Workout" : "Add Workout"}</button>
        <button onClick={backToPanel}>Back to Admin Panel</button>
        {editingWorkout && (
    <button
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
    </button>
    
  )}
</form>

      <table>
        <thead>
          <tr>
            <th>Name</th><th>User</th><th>Type</th><th>Date</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {workouts.map((w) => (
            <tr key={w.id}>
              <td>{w.name}</td>
              <td>{w.user_name}</td>
              <td>{w.type}</td>
              <td>{w.date?.slice(0, 10)}</td>
              <td>
                <button onClick={() => handleEdit(w)}>Edit</button>
                <button onClick={() => handleDelete(w.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default AdminWorkouts;
