const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const OpenAIApi = require("openai").OpenAIApi;
const Configuration = require("openai").Configuration;
require("dotenv").config();

const configuration = new Configuration({
  organization: "org-CjIl4vnLKCaPqr6WGtIhrpQA",
  apiKey: process.env.API_KEY,
 
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, Content-Length, X-Requested-With"
    );
    next();
  });

app.post("/generate-text", async (req, res) => {
    
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md"
      }
    });
    return;
  }
 
  const text = req.body.text || "";
  if (text.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid text"
      }
    });
    return;
  }

  const temperature = parseFloat(req.body.temperature) || 0.7;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: text,
      temperature: temperature
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request."
        }
      });
    }
  }
});
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
