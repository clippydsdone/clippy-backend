const express = require('express');
const bodyParser = require('body-parser');

const app = express()
const PORT = process.env.PORT || 5000;

const SemanticScholarApi = require('./integrations/semanticScholar.js');
const HuggingFaceApi = require('./integrations/huggingFace.js');
const D3proxy = require('./proxy/d3proxy.js');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/semantic/paper/id/:id', async (req, res) => {
  var paperId = req.params.id;
  var result = await SemanticScholarApi.searchPaperById(paperId);
  result.data.references = D3proxy.parseReferencesToD3Json(result.data.paperId, result.data.title, result.data.references);
  res.status(result.status);
  res.send(result.data);
});

app.post('/semantic/paper/search', async (req, res) => {
  var query = req.body.query;
  var response = await SemanticScholarApi.searchPaperIdByKeywoard(query);
  var paperId = response.data[0].paperId;
  var result = await SemanticScholarApi.searchPaperById(paperId);
  result.data.references = D3proxy.parseReferencesToD3Json(result.data.paperId, result.data.title, result.data.references);
  res.status(result.status);
  res.send(result.data);
});

app.post('/semantic/paper/search_multiple', async (req, res) => {
  var query = req.body.query;
  var response = await SemanticScholarApi.searchPaperIdByKeywoard(query);

  var results = []; 
  for(var i = 0; i < response.data.length; i++) {
    var curr = await SemanticScholarApi.searchPaperById(response.data[i].paperId);
    results.push(curr);
  }
  results.data = results;
  res.send(results.data);
});