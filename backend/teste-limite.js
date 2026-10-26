const express = require("express");
const rateLimit = require("express-rate-limit");

const app = express();

app.set("trust proxy", false);

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { mensagem: "Limite atingido." },
  })
);

app.get("/", (req, res) => {
  res.status(200).send("Permitido");
});

app.listen(3001, () => {
  console.log("Teste do limitador em http://localhost:3001");
});
