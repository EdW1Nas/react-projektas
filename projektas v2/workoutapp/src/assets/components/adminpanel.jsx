import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {

    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:3001/users', { withCredentials: true })
          .then(res => setUsers(res.data))
          .catch(err => {
            if (err.response?.status === 403 || err.response?.status === 401) {
              navigate('/dashboard');
            }
          });
      }, []);


      const updateRole = (id, newRole) => {
        axios.put(`http://localhost:3001/users/${id}/role`, { role: newRole }, { withCredentials: true })
          .then(() => {
            setUsers(users.map(u => (u.id === id ? { ...u, role: newRole } : u)));
          })
          .catch(err => alert('Failed to update role'));
      };

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
          <h1>Admin Panel</h1>
          <table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Role</th></tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={handleLogout}>Logout</button>
        </section>
      );
    };
    
    export default AdminPanel;