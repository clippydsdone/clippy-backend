const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express()
const PORT = process.env.PORT || 5000;

const SemanticScholarApi = require('./integrations/semanticScholar.js');
const D3proxy = require('./proxy/d3proxy.js');

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/semantic/paper/id/:id', async (req, res) => {
  try {
    const paperId = req.params.id;
    const result = await SemanticScholarApi.searchPaperById(paperId);
    result.data.references = D3proxy.parseReferencesToD3Json(result.data.paperId, result.data.title, result.data.references);
    res.status(result.status);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(result.data);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send({ "err": e }, 404);
  }
});

app.post('/semantic/paper/base64', async (req, res) => {
  const query = req.body.query;
  const response = await SemanticScholarApi.searchPaperIdByKeywoard(query);
  const paperId = response.data[0].paperId;
  const result = await SemanticScholarApi.searchPaperById(paperId);
  const url = result.data.openAccessPdf.url;
  console.log(url);

  try {
    await axios({
      method: 'get',
      url: url,
      responseType: 'arraybuffer'
    })
      .then((response) => {
        console.log("parsing");
        result.data = Buffer.from(response.data, 'binary').toString('base64')
        console.log("parsing");
      })
      .catch((err) => {
        console.log(err);
        result.status = err.response.status;
        result.data = err.message;
      });
      res.status(result.status);
      res.header("Access-Control-Allow-Origin", "*");
      res.send(result.data);
  }
  catch (e) {
    console.log(e);
    res.header("Access-Control-Allow-Origin", "*");
    res.send({ "err": e }, 404);
  }
});

app.post('/semantic/paper/search', async (req, res) => {
  try {
    const query = req.body.query;
    const response = await SemanticScholarApi.searchPaperIdByKeywoard(query);
    const paperId = response.data[0].paperId;
    const result = await SemanticScholarApi.searchPaperById(paperId);
    result.data.references = D3proxy.parseReferencesToD3Json(result.data.paperId, result.data.title, result.data.references);
    res.status(result.status);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(result.data);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send({ "err": e }, 404);
  }
});

app.post('/semantic/paper/search_multiple', async (req, res) => {
  try {
    var query = req.body.query;
    var response = await SemanticScholarApi.searchPaperIdByKeywoard(query);

    var results = [];
    for (var i = 0; i < response.data.length; i++) {
      var curr = await SemanticScholarApi.searchPaperById(response.data[i].paperId);
      results.push(curr);
    }
    results.data = results;
    res.header("Access-Control-Allow-Origin", "*");
    res.send(results.data);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send({ "err": e }, 404);
  }
});


