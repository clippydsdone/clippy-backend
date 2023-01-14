const express = require('express');
const cors = require('cors');

const app = express()
const PORT = process.env.PORT || 5000;

const SemanticScholarApi = require('./integrations/semanticScholar.js');
const PdfStringify = require('./integrations/pdfStringify.js');
const D3proxy = require('./proxy/d3proxy.js');


app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS
}));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
  next();
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));

app.get('/', (req, res) => {
  res.send('Hello, Clippy!');
});

app.get('/semantic/paper/id/:id', async (req, res) => {
  try {
    const paperId = req.params.id;
    const result = await SemanticScholarApi.searchPaperById(paperId);
    result.data.references = await D3proxy.parseReferencesToD3Json(result.data.paperId, result.data.title, result.data.references);

    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.status(result.status);
    res.send(result.data);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.send({ "err": e }, 404);
  }
});

app.post('/semantic/paper/base64', async (req, res) => {
  try {
    const query = req.body.query;
    const response = await SemanticScholarApi.searchPaperIdByKeywoard(query);
    const paperId = response.data[0].paperId;
    let result = await SemanticScholarApi.searchPaperById(paperId);

    if (!result.data.isOpenAccess) {
      throw new Error("PDF document is not publicly available.")
    }

    const url = result.data.openAccessPdf.url;
    result = await PdfStringify.getPdfBase64(url);
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.status(result.status);
    res.send(result);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.send({ "err": e }, 404);
  }
});

app.get('/semantic/paper/base64/id/:id', async (req, res) => {
  try {
    const paperId = req.params.id;
    let result = await SemanticScholarApi.searchPaperById(paperId);

    if (!result.data.isOpenAccess) {
      throw new Error("PDF document is not publicly available.")
    }

    const url = result.data.openAccessPdf.url;
    result = await PdfStringify.getPdfBase64(url);
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.status(result.status);
    res.send(result);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.send({ "err": e }, 404);
  }
});

app.post('/semantic/paper/search', async (req, res) => {
  try {
    const query = req.body.query;
    const response = await SemanticScholarApi.searchPaperIdByKeywoard(query);
    const paperId = response.data[0].paperId;
    const result = await SemanticScholarApi.searchPaperById(paperId);
    result.data.references = await D3proxy.parseReferencesToD3Json(result.data.paperId, result.data.title, result.data.references);
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.status(result.status);
    res.send(result.data);
  }
  catch (e) {
    console.log(e);
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.send({ "err": e }, 404);
  }
});

app.post('/semantic/paper/search_multiple', async (req, res) => {
  try {
    let results = [];
    let query = req.body.query;
    let response = await SemanticScholarApi.searchPaperIdByKeywoard(query);

    for (const element of response.data) {
      let curr = await SemanticScholarApi.searchPaperById(element.paperId);
      results.push(curr);
    }
    results.data = results;
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.send(results.data);
  }
  catch (e) {
    res.header("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGINS);
    res.send({ "err": e }, 404);
  }
});


