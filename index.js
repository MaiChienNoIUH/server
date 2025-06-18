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

app.get('/users/me', async (req, res) => {
  const token = req.headers.authorization;

  try {
    const wpRes = await fetch('https://pinxedien.nuta.io/wp-json/wp/v2/users/me?context=edit', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const wpText = await wpRes.text(); // đọc raw nội dung để debug
    console.log('🪵 WP /users/me status:', wpRes.status);
    console.log('🪵 WP /users/me body:', wpText);

    res.status(wpRes.status).send(wpText); // Trả lại raw
  } catch (err) {
    console.error('❌ Proxy /users/me error:', err);
    res.status(500).json({ message: 'Lỗi proxy users/me', error: err.toString() });
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

