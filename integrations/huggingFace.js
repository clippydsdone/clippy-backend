const axios = require('axios');

async function modelOutput(modelName, text) {
    const getReq = 'https://api-inference.huggingface.co/models/' + modelName;
    var result = { "status": 200, "data": null }
    await axios({
        method: 'post',
        url: getReq,
        body: { 'inputs': text }
    })
        .then((response) => {
            result.data = { "hugging_face": response.data[0].summary_text };
        })
        .catch((err) => {
            result.status = err.response.status;
            result.data = err.message;
        });
    return result;
};

exports.modelOutput = modelOutput