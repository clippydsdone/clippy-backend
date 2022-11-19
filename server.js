const express = require('express');
const bodyParser = require('body-parser');
const PythonShell = require('python-shell').PythonShell;

const app = express()
const PORT = process.env.PORT || 5000;

const SemanticScholarApi = require('./integrations/semanticScholar.js');
const HuggingFaceApi = require('./integrations/huggingFace.js');

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/semantic/paper/:id', async (req, res) => {
  var paperId = req.params.id;
  var result = await SemanticScholarApi.searchPaperById(paperId);
  res.status(result.status);
  res.send(result.data);
});

// TODO: Summarize from all avilable models
app.post('/summarize/all', async (req, res) => {
  res.send();
});

app.post('/summarize/huggingFace', async (req, res) => {
  var options = {
    args: req.body.text
  };

  PythonShell.run('./models/facebook/bart-large-cnn.py', options, function (err, results) {
    if (err) throw err;
    res.send(results[0]);
  })
});

  // var result = await HuggingFaceApi.modelOutput(req.body.model, req.body.text);
  // res.status(result.status);
  // res.send(result.data);

