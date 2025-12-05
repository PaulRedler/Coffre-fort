const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ status: "backend ok" });
});

app.listen(4000, () => console.log("Backend running on port 4000"));
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);
const docRoutes = require('./routes/documents');
app.use('/api/documents', docRoutes);
