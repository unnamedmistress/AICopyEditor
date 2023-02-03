const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

const form = document.getElementById("text-form");
      form.addEventListener("submit", async event => {
        event.preventDefault();
        
        const textvalue = document.getElementById("text-input").value;
       
        const temperature = document.getElementById("temperature-input").value;
        const audience = document.getElementById("audience-input").value;
         const text = `Correct this text: ${textvalue} and enhance this for my intended audience: ${audience}`;
        try {
            const response = await axios.post("http://localhost:3001/generate-text", {
            text,
            temperature,
            audience
          });
          const result = document.getElementById("result");
          result.innerHTML = response.data.result;
        } catch (error) {
          console.error(error);
        }
      });