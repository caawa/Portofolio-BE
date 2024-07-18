import mysql from 'mysql';

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'sekolah'
});

conn.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});

export default conn;