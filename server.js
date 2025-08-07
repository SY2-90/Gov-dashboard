require('dotenv').config();
console.log('DATABASE_URL:', process.env.DATABASE_URL);

const express = require('express');
const path = require('path');
const { Client } = require('pg');

const app = express();
const PORT = process.env.PORT || 10000;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

client.connect()
  .then(() => console.log('✅ PostgreSQL connected'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/inspections', async (req, res) => {
  try {
    const result = await client.query(`
      SELECT 
        "사이트명" AS site, 
        "점검일" AS date, 
        "상태" AS status, 
        "비고" AS remark 
      FROM inspections 
      ORDER BY "점검일" DESC 
      LIMIT 10
    `);

    const mappedRows = result.rows.map(row => ({
      site: row.site,
      date: new Date(row.date).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }),
      status: row.status,
      remark: row.remark,
    }));

    res.json(mappedRows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '데이터 조회 실패' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});