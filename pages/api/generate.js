const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const OpenAIApi = require("openai").OpenAIApi;
const Configuration = require("openai").Configuration;
require("dotenv").config();

const configuration = new Configuration({
  organization: "org-CjIl4vnLKCaPqr6WGtIhrpQA",
  apiKey: "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"
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());

app.post("/generate-animal-names", async (req, res) => {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md"
      }
    });
    return;
  }

  const animal = req.body.animal || "";
  if (animal.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Please enter a valid animal"
      }
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(animal),
      temperature: 0.6
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

function generatePrompt(animal) {
  const capitalizedAnimal =
    animal[0].toUpperCase() + animal.slice(1).toLowerCase();
  return `Suggest three names for an animal that is a superhero.

Animal: Cat
Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
Animal: Dog
Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
Animal: ${capitalizedAnimal}
Names:`;
}

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
