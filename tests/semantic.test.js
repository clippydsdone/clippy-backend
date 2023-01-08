const axios = require('axios');

jest.setTimeout(30 * 1000);

text = `The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct.`

describe('Hugging face API testing', () => {
    test('TB13 - Get summary from Hugging face without API key', async () => {
        await axios({
            method: 'post',
            url: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            body: { 'inputs': text }
        })
            .then((response) => {
                expect(response.status).toBe(200);
                expect.stringContaining("summary_text");
            })
            .catch((err) => expect(err.response.status).toBe(429)
            );
    });

    test('TB14 - Get summary from Hugging face with invalid API key', async () => {
        await axios({
            method: 'post',
            url: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
            headers: { Authorization: "invalid key" },
            body: { 'inputs': text }
        })
            .then((response) => {
            })
            .catch((err) => {
                expect.stringContaining("invalid");
                expect(err.response.status).toBe(400);
            });
    });

    test('TB15 - Get summary from Hugging face invalid input', async () => {
        await axios({
            method: 'post',
            url: "https://api-inference.huggingface.co/models/facebook/bart-large-cnn"
                })
            .then((response) => {
                expect.stringContaining("summary_text");
            })
            .catch((err) => {
                expect(err.response.status).toBe(429);
            });
    });
});