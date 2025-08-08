require('dotenv').config();
const express = require('express');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const app = express();
const PORT = process.env.PORT || 10000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/inspections', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('inspections')
      .select('사이트명, 점검일, 상태, 비고')
      .order('점검일', { ascending: false })
      .limit(10);

    if (error) throw error;

    const mappedRows = data.map(row => ({
      site: row['사이트명'],
      date: new Date(row['점검일']).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' }),
      status: row['상태'],
      remark: row['비고'],
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