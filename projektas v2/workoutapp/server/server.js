const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');


const app = express();
app.use(cors());
app.use(express.json());

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

app.listen(3308, () => {
    console.log('backend running on http://localhost:3308');
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