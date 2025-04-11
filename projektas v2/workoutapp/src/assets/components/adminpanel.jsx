import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, Link } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";

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

      const workoutCreator = async() => {
        navigate('/adminworkouts');
      }

      const handleUserDelete = async (id) => {
        try {
          await axios.delete(`http://localhost:3001/users/${id}`, { withCredentials: true });
          setUsers(users.filter(user => user.id !== id));
        } catch (err) {
          console.error("failed to delete user", err);
        }
      };



      return (
        <section>
          <GlobalStyle />
          <Title>Admin Panel</Title>
          <Table>
            <thead>
              <tr><th>ID</th><th>Name</th><th>Role</th><th>Delete User</th></tr>
            </thead>
            <tbody>
            {users.map((user) => (
                <tr key={user.id}>
                  <Td>{user.id}</Td>
                  <Td>{user.name}</Td>
                  <Td>
                    <Select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value)}
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      
                    </Select>
                  </Td>
                  <Td> <Button onClick={() => handleUserDelete(user.id)}>Delete</Button></Td>
                </tr>
              ))}
            </tbody>
          </Table>
          <BackButton onClick={handleLogout}>Logout</BackButton>
          <PageButton onClick={workoutCreator}>Admin Workout Creator</PageButton>
        </section>
      );
    };
    
    export default AdminPanel;

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

`;

  const PageButton = styled.button`
  background: #6a11cb;
  color: white;
  padding: 12px;
  margin: 24px;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s ease;
  border: none;
  outline: none;

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