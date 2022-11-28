const express = require('express');
const cors = require('cors');

const app = express()
const PORT = process.env.PORT || 5000;

const SemanticScholarApi = require('./integrations/semanticScholar.js');
const HuggingFaceApi = require('./integrations/huggingFace.js');
const D3proxy = require('./proxy/d3proxy.js');

app.use(express.json());

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
};

app.use(allowCrossDomain);

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/semantic/paper/id/:id', async (req, res) => {
  try {
    var paperId = req.params.id;
    var result = await SemanticScholarApi.searchPaperById(paperId);
    result.data.references = D3proxy.parseReferencesToD3Json(result.data.paperId, result.data.title, result.data.references);
    res.status(result.status);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(result.data);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send({ "err": e });
  }
});

app.post('/semantic/paper/search', async (req, res) => {
  try {
    var query = req.body.query;
    var response = await SemanticScholarApi.searchPaperIdByKeywoard(query);
    var paperId = response.data[0].paperId;
    var result = await SemanticScholarApi.searchPaperById(paperId);
    result.data.references = D3proxy.parseReferencesToD3Json(result.data.paperId, result.data.title, result.data.references);
    res.status(result.status);
    res.header("Access-Control-Allow-Origin", "*");
    res.send(result.data);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", "*");
    res.send({ "err": e });
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
    res.send({ "err": e });
  }
});