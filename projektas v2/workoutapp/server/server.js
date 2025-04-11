const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123',
    database: 'workoutapp'
});

db.connect(err => {
    if (err) {
        console.error('connect failed:', err);
        return;
    }
    console.log('connected');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


//register
app.post('/register', async (req, res) => {
    const { username, password } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      db.query(
        'INSERT INTO users (name, password) VALUES (?, ?)',
        [username, hashedPassword],
        (err, result) => {
          if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
              return res.status(409).json({ message: 'username taken' });
            }
            console.error(err);
            return res.status(500).json({ message: 'error' });
          }
  
          res.status(201).json({ message: 'user registered' });
        }
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'error' });
    }
  });


  //login
  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    db.query('SELECT * FROM users WHERE name = ?', [username], async (err, result) => {
      if (err) return res.status(500).json({ message: 'database error' });
      if (result.length === 0) return res.status(401).json({ message: 'user not found' });
  
      const user = result[0];
  
      const match = await bcrypt.compare(password, user.password);
      if (!match) return res.status(401).json({ message: 'incorrect password' });
  
      const token = jwt.sign(
        {
          id: user.id,
          name: user.name,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 1000 * 60 * 60 * 24
      });
  
      res.json({ message: 'logn successful', role: user.role });
      
    });
  });

  //dashboard
  app.get('/dashboard', (req, res) => {
    const token = req.cookies.token;
  
    if (!token) {
      return res.status(401).json({ message: 'no token' });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'invalid token' });
      }
  
      res.json({
        message: `Welcome ${decoded.name}!`,
        role: decoded.role
      });
    });
  });


  //logout
  app.post('/logout', (req, res) =>{

    res.clearCookie('token', {
      httpOnly:true,
      sameSite:'lax',
      secure:false

    });
    res.json({message: 'logged out'});
  });

  //get all users
  app.get('/users', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify (token,process.env.JWT_SECRET, (err,decoded) =>{
      if (err) return res.sendStatus(403);
      if (decoded.role !== 'Admin') return res.sendStatus(403);

      db.query('SELECT id, name, role FROM users', (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        res.json(results);
      });


    });

  });

  //update role
  app.put('/users/:id/role', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      if (decoded.role !== 'Admin') return res.sendStatus(403);

      const userId = req.params.id;
      const newRole = req.body.role;

      console.log(`Updating user ${userId} to role: ${newRole}`);

      db.query(
        'UPDATE users SET role = ? WHERE id = ?',
        [newRole, userId],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'ppdate failed' });
          res.json({ message: 'role updated' });
        }
      );
    });
  });


  //get workouts
  app.get('/workouts', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      
      const isAdmin = decoded.role === 'Admin';
  
      const sql = isAdmin
      ? 'SELECT workouts.*, users.name as user_name FROM workouts JOIN users ON workouts.user_id = users.id'
      : 'SELECT * FROM workouts WHERE user_id = ?';

      const params = isAdmin ? [] : [decoded.id];
      
      db.query(sql, params, (err, results) => {
        if (err) return res.status(500).json({ message: 'DB error' });
        res.json(results);
      });
    });
  });

  //add workouts
  app.post('/workouts', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      if (decoded.role !== 'Admin') return res.sendStatus(403);
  
      const { name, description, type, date, user_id } = req.body;
  
      db.query(
        'INSERT INTO workouts (user_id, name, description, type, date) VALUES (?, ?, ?, ?, ?)',
        [user_id, name, description, type, date],
        (err, result) => {
          if (err) return res.status(500).json({ message: 'DB error' });
          res.json({ message: 'workout addded' });
        }
      );
    });
  });

  //update workout
  app.put('/workouts/:id', (req, res) => {


    const token = req.cookies.token;
    if (!token) return res.sendStatus(401);
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      if (decoded.role !== 'Admin') return res.sendStatus(403);
  
      const workoutId = req.params.id;
      const { name, description, type, date } = req.body;
  
      const sql = 'UPDATE workouts SET name = ?, description = ?, type = ?, date = ? WHERE id = ?';
      const params = [name, description, type, date, workoutId];
  
      db.query(sql, params, (err, result) => {
        if (err) return res.status(500).json({ message: 'update failed' });
        res.json({ message: 'wrkout updated' });
      });
    });
  });

//delete workouts
app.delete('/workouts/:id', (req, res) => {

  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    if (decoded.role !== 'Admin') return res.sendStatus(403);

    const workoutId = req.params.id;

    const sql = 'DELETE FROM workouts WHERE id = ?';
    const params = [workoutId];

    db.query(sql, params, (err, result) => {
      if (err) return res.status(500).json({ message: 'delete fail' });
      res.json({ message: 'workout deleted' });
    });
  });
});

//delete user
app.delete ('/users/:id', (req, res) => {

  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.sendStatus(403);
    if (decoded.role !== 'Admin') return res.sendStatus(403);

    const userId = req.params.id;

    const sql = 'DELETE FROM users WHERE id =?';
    const params = [userId];

    db.query (sql, params, (err, result) => {
      if (err) return res.status(500).json({ message: 'delete fail' });
      res.json({ message: 'user deleted' });
    });
  });
});


