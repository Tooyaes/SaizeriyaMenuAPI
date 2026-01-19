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

app.listen(port, () => {
    console.log(`Server is runnning at http://localhost:${port}`);
});