const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

const callbacks = {};

app.use(cors());
app.use(express.urlencoded({ extended: true }));

// This is the callback endpoint the 3DS Method POSTs to
app.post('/3ds-callback', (req, res) => {
  const { unique_id, threeds_method_status, signature } = req.body;

  if (!unique_id || !threeds_method_status || !signature) {
    return res.status(400).send('Missing fields');
  }

  callbacks[unique_id] = {
    status: threeds_method_status,
    receivedAt: new Date(),
  };

  console.log('Received 3DS Method callback:', req.body);
  res.send('OK');
});

// This endpoint is polled by your frontend
app.get('/status', (req, res) => {
  const { unique_id } = req.query;

  if (callbacks[unique_id]) {
    res.json({ status: callbacks[unique_id].status });
  } else {
    res.json({ status: 'pending' });
  }
});

app.listen(port, () => {
  console.log(`3DS Method backend running at http://localhost:${port}`);
});
