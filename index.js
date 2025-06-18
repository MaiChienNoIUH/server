const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ✅ Login proxy
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const wpRes = await fetch('https://pinxedien.nuta.io/wp-json/jwt-auth/v1/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const wpJson = await wpRes.json();
    res.status(wpRes.status).json(wpJson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi proxy login' });
  }
});

// ✅ Proxy lấy thông tin người dùng
app.get('/users/me', async (req, res) => {
  const token = req.headers.authorization;

  try {
    const wpRes = await fetch('https://pinxedien.nuta.io/wp-json/wp/v2/users/me?context=edit', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const wpJson = await wpRes.json();
    res.status(wpRes.status).json(wpJson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi proxy users/me' });
  }
});

// ✅ Proxy thống kê
app.get('/statistic-group', async (req, res) => {
  const token = req.headers.authorization;
  const { group_by, target_date } = req.query;

  const url = `https://pinxedien.nuta.io/wp-json/custom/v1/statistic-group?group_by=${group_by}&target_date=${target_date}`;

  try {
    const wpRes = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const wpJson = await wpRes.json();
    res.status(wpRes.status).json(wpJson);
  } catch (err) {
    res.status(500).json({ message: 'Lỗi proxy statistic-group' });
  }
});

// ✅ Proxy lấy danh sách tasks
app.get('/tasks', async (req, res) => {
  const token = req.headers.authorization;

  try {
    const wpRes = await fetch('https://pinxedien.nuta.io/wp-json/custom/v1/tasks', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const wpJson = await wpRes.json();
    res.status(wpRes.status).json(wpJson);
  } catch (err) {
    console.error('Lỗi proxy tasks:', err);
    res.status(500).json({ message: 'Lỗi proxy tasks' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

