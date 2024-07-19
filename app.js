  import express from 'express';
  import conn from './config/db.js';
  import cors from 'cors';


  const app = express();

  app.use(express.json());

  app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));
  
  app.get('/get-siswa', function (req, res) {
      const queryStr = 'SELECT * FROM siswa WHERE deletedAt IS NULL';
      conn.query(queryStr, (err, results) => {
        if (err) {
          res.status(500).json({
            "success": false,
            "message": err.sqlMessage
          });
        } else {
          res.status(200).json({
            "success": true,
            "message": "Sukses menampilkan data",
            "data": results
          });
        }
      });
  });

  app.post('/store-siswa', function (req, res) {
    const { nama, jurusan, kelas } = req.body;
    
    if (!nama || !jurusan || !kelas) {
      return res.status(400).json({
        success: false,
        message: "Data tidak lengkap. Nama, jurusan, dan kelas harus diisi."
      });
    }
  
    const queryStr = 'INSERT INTO siswa (nama, jurusan, kelas) VALUES (?, ?, ?)';
    const values = [nama, jurusan, kelas];
  
    conn.query(queryStr, values, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          success: false,
          message: "Gagal menyimpan data: " + err.message
        });
      }
      res.status(200).json({
        success: true,
        message: "Sukses menyimpan data",
        data: null
      });
    });
  });
  
  app.get('/get-siswa-by-id', function (req, res) {
      const param = req.query;
      const id = param.id;
      const queryStr = 'SELECT * FROM siswa WHERE deletedAt IS NULL AND id = ?';
      const values = [id];
      conn.query(queryStr, values, (err, results) => {
        if (err) {
          res.error(err.sqlMessage, res);
        } else {
          res.status(200).json({
            "success" : true,
            "message" : "Sukses menampilkan data",
            "data" : null
          });
        }
      })
    })

    app.post('/update-siswa', function (req, res) {
      const param = req.body;
      const id = param.id;
      const nama = param.nama;
      const jurusan = param.jurusan;
      const kelas = param.kelas;
      const queryStr = 'UPDATE siswa SET nama = ?, jurusan = ?, kelas = ? WHERE id = ? AND deletedAt IS NULL';
      const values = [nama, jurusan, kelas, id];
      conn.query(queryStr, values, (err, results) => {
        if (err) {
          console.log(err);
        } else {
          res.status(200).json({
            "success" : true,
            "message" : "Sukses mengubah data",
            "data" : null
          });
        }
      })
    })

    app.post('/delete-siswa', function (req, res) {
      const param = req.body;
      const id = param.id;
      const queryStr = 'UPDATE siswa SET deletedAt = ? WHERE id = ?';
      const now = new Date();
      const values = [now, id];
      conn.query(queryStr, values, (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({
            success: false,
            message: "Gagal menghapus siswa",
            error: err.message
          });
        }
        res.status(200).json({
          success: true,
          message: "Sukses menghapus data",
          data: null
        });
      });
    });

  app.listen(3000, () => {
      console.log('Server berjalan di port 3000');
  });