const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
const port = 3001
const Pool = require('pg').Pool

const pool = new Pool({
  host: 'postgres',
  port: 5432,
  user: 'uwu',
  password: 'password',
  database: 'datalol'
})

app.use(cors())
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({ extended: true })
)

app.get('/data', async (req, res) => {
  const result = await pool.query('SELECT * FROM flats');
  res.json(result.rows);
});

function addData(title, imgurl){
  const q = `INSERT INTO flats (title, imgurl) VALUES ('${title}', '${imgurl}')`;
  pool.query(q, (error) => {
    if (error) { throw error; };
  });
}

function makeData() {
  fetch("https://www.sreality.cz/api/en/v2/estates?category_main_cb=1&category_type_cb=1&page=1&per_page=500",)
    .then(res => res.json())
    .then(data => {
      data._embedded.estates.forEach((element) => {
        addData(element.name, element._links.images[0].href);
      });
      console.log("Data added successfully")
    })
    .catch((error) => console.error(error));
}

makeData();

app.post('/add_data', (request, response) => {
  const { title, imgurl } = request.body;
  const q = `INSERT INTO flats (title, imgurl) VALUES ('${title}', '${imgurl}')`;
  pool.query(q, (error, result) => {
    if (error) { throw error; }
    response.status(201).send('Data added successfully');
  });
});


app.listen(port, () => {
  console.log(`running on port ${port}.`)
})