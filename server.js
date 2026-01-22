require('dotenv').config();
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

console.log("URL:", process.env.SUPABASE_URL);

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.get('/', (req, res) => {
    console.log("1/random access");
    res.send('サイゼリヤAPIサーバー /randomでメニューが引ける');
});

//get random
app.get('/random', async (req, res) => {
    try {
        console.log("2: Supabaseからデータを取得中...");
        const {data, error} = await supabase.from('SaizeriyaMenu').select('*');

        if(error) throw error;

        console.log("3: 取得したデータ:", data);
        
        const randomIndex = Math.floor(Math.random() * data.length);
        const selectedMenu = data[randomIndex];

        res.json(selectedMenu);
    }catch (err) {
        res.status(500).json({error: 'データが取得できませんでした'});
    }
});

//get all
app.get('/all', async (req, res) => {
    console.log("全件取得のリクエストが来ました");
    try {
        const { data, error } = await supabase.from('SaizeriyaMenu').select('*');
        if (error) throw error;
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//get menu from id
app.get('/menu/:id', async (req, res) => {
  const { id } = req.params;
  console.log(`ID: ${id} の取得リクエストが来ました`);
  try {
    const { data, error } = await supabase
      .from('SaizeriyaMenu')
      .select('*')
      .eq('id', id)
      .single(); // 1件だけ取得

    if (error) throw error;
    if (!data) return res.status(404).json({ error: "見つかりませんでした" });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
    console.log(`Server is runnning at http://localhost:${port}`);
});