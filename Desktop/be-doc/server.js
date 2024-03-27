const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require('./config/dbConfig');
const path = require('path');

// import { fileURLToPath } from 'url';
// Resolving dirname for ES module
const _filename = __filename;
const _dirname = path.dirname(_filename);
app.use(express.json());

const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const doctorRoute = require('./routes/doctorsRoute');

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/doctor', doctorRoute);

const port = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, './client/build')));
app.get('*', function (_, res) {
  res.sendFile(
    path.join(__dirname, './client/build/index.html'),
    function (err) {
      res.status(500).send(err);
    }
  );
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
