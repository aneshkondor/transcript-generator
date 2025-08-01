const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose()
const path = require('path')

// Initialize SQLite database
const dbPath = path.resolve(__dirname, 'data.sqlite')
const db = new sqlite3.Database(dbPath)

// Create tables if not exist
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS admin_users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    )
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS transcripts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      student_name TEXT NOT NULL,
      student_ssn TEXT NOT NULL,
      data TEXT NOT NULL,
      created_by INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(created_by) REFERENCES admin_users(user_id)
    )
  `)

  // Seed default admin user if none exists
  const defaultEmail = 'admin@transcript.com'
  const defaultPassword = 'transcript2025'
  const defaultName = 'Administrator'
  db.get(`SELECT COUNT(*) as count FROM admin_users WHERE email = ?`, [defaultEmail], (err, row) => {
    if (!err && row.count === 0) {
      db.run(`INSERT INTO admin_users (email, password, name) VALUES (?, ?, ?)`, [defaultEmail, defaultPassword, defaultName])
    }
  })
})

const app = express()
app.use(cors())
app.use(bodyParser.json())

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  db.get(
    `SELECT user_id, email, name FROM admin_users WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err) return res.status(500).json({ error: err.message })
      if (!row) return res.status(401).json({ error: 'Invalid credentials' })
      res.json({ success: true, user: row })
    }
  )
})

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body
  db.run(
    `INSERT INTO admin_users (email, password, name) VALUES (?, ?, ?)`,
    [email, password, name],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ success: true, userId: this.lastID })
    }
  )
})

// Transcript endpoints
app.post('/api/transcripts', (req, res) => {
  const { transcriptData, name, userId } = req.body
  const dataStr = JSON.stringify(transcriptData)
  db.run(
    `INSERT INTO transcripts (name, student_name, student_ssn, data, created_by) VALUES (?, ?, ?, ?, ?)`,
    [name, transcriptData.studentName, transcriptData.ssn, dataStr, userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      db.get(`SELECT * FROM transcripts WHERE id = ?`, [this.lastID], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message })
        res.json({ success: true, transcript: row })
      })
    }
  )
})

app.get('/api/transcripts', (req, res) => {
  db.all(
    `SELECT t.*, a.name as admin_name, a.email as admin_email FROM transcripts t JOIN admin_users a ON t.created_by = a.user_id ORDER BY t.created_at DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ success: true, transcripts: rows })
    }
  )
})

app.put('/api/transcripts/:id', (req, res) => {
  const { id } = req.params
  const { transcriptData, name } = req.body
  const dataStr = JSON.stringify(transcriptData)
  db.run(
    `UPDATE transcripts SET name = ?, student_name = ?, student_ssn = ?, data = ? WHERE id = ?`,
    [name, transcriptData.studentName, transcriptData.ssn, dataStr, id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message })
      db.get(`SELECT * FROM transcripts WHERE id = ?`, [id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message })
        res.json({ success: true, transcript: row })
      })
    }
  )
})

app.delete('/api/transcripts/:id', (req, res) => {
  const { id } = req.params
  db.run(`DELETE FROM transcripts WHERE id = ?`, [id], function (err) {
    if (err) return res.status(500).json({ error: err.message })
    res.json({ success: true })
  })
})

app.get('/api/transcripts/ssn/:ssn', (req, res) => {
  const { ssn } = req.params
  db.all(
    `SELECT t.*, a.name as admin_name, a.email as admin_email FROM transcripts t JOIN admin_users a ON t.created_by = a.user_id WHERE t.student_ssn = ? ORDER BY t.created_at DESC`,
    [ssn],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message })
      res.json({ success: true, transcripts: rows })
    }
  )
})

// File storage endpoints (Optional: implement file handling with filesystem)

const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
