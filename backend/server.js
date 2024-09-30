const express = require("express");
const path = require("path");
const axios = require("axios");
const https = require("https");

require("dotenv").config({ path: path.join(__dirname, ".env") });

const app = express();

const LOWCODE_CONFIG = {
  baseUrl: "https://itsmx-dev.centralit.com.br/",
  jwtToken: process.env.LOWCODE_JWT,
};

const api = axios.create({
  baseURL: LOWCODE_CONFIG.baseUrl,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Authorization: `Bearer ${LOWCODE_CONFIG.jwtToken}`,
  },
  validateStatus: function (status) {
    console.log("REQUEST_STATUS", status);
    return status >= 200 && status < 300; // default
  },

  httpsAgent: new https.Agent({
    rejectUnauthorized: false,
  }),
});

// Mostrar a pasta src para o navegador.
// Importante para que os arquivos JS e CSS sejam alcançadas pelo angular
// app.use(express.static(__dirname + "/web/src"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Rotas para executar POST */
app.post("/rule", (req, res) => {
  console.log(LOWCODE_CONFIG.baseUrl);
  console.log("PAYLOAD", { ...req.body });
  const bodyRequest = { ...req.body }; //Transformar em JSONObject
  let timing = { inicio: new Date() };

  api
    .post(
      `/lowcode/esi/rule/executeWithMap/${bodyRequest.ruleName}`,
      bodyRequest.data
    )
    .then((resultado) => {
      timing.fim = new Date();
      if (resultado.data) {
        return res.json({
          ...resultado.data,
          DEBUG: "RESPOSTA DO AXIOS",
        });
      }
      return res.json({
        DEBUG: "DATA nao existe na RESPOSTA DO AXIOS",
      });
    })
    .catch((error) => {
      return res.status(409).json(error.response?.data?.message || "ERRO");
    });
});

app.post("/flow", (req, res) => {
  console.log(LOWCODE_CONFIG.baseUrl);
  console.log("PAYLOAD", { ...req.body });
  const bodyRequest = { ...req.body }; //Transformar em JSONObject

  api
    .post(`/lowcode/esi/execute/${bodyRequest.flowName}`, bodyRequest.data)
    .then((resultado) => {
      if (resultado.data) {
        return res.json({
          ...resultado.data,
          DEBUG: "RESPOSTA DO AXIOS",
        });
      }

      return res.json({
        DEBUG: "DATA nao existe na RESPOSTA DO AXIOS",
      });
    })
    .catch((error) => {
      return res
        .status(409)
        .json(error.response.data.message || error.response || "ERRO");
    });
});

app.post("/faas", (req, res) => {
  console.log(
    "LEMBRE-SE QUE NO LOWCODE DE VERDADE O FAAS NAO FAZ PARTE DO RuntimeManagerRepository. A FORMA CORRETA HE $SCOPE.EXECUTEFAAS(NOME, MAP) "
  );
  console.log(LOWCODE_CONFIG.baseUrl);
  console.log("PAYLOAD", { ...req.body });
  const bodyRequest = { ...req.body }; //Transformar em JSONObject

  api
    .post(`/lowcode/faas/run/${bodyRequest.flowName}`, bodyRequest.data)
    .then((resultado) => {
      if (resultado.data) {
        return res.json({
          ...resultado.data,
          DEBUG: "RESPOSTA DO AXIOS",
        });
      }
      return res.json({
        DEBUG: "DATA nao existe na RESPOSTA DO AXIOS",
      });
    })
    .catch((error) => {
      return res.status(409).json(error.message);
    });
});

app.post("/createOrUpdateList", (req, res) => {
  const bodyRequest = { ...req.body }; //Transformar em JSONObject

  api
    .post(
      `/lowcode/rest/dynamic/${bodyRequest.project}/${bodyRequest.businessObject}/createOrUpdateList`,
      bodyRequest.data
    )
    .then((resultado) => {
      if (resultado.data) {
        return res.json({
          ...resultado.data,
          DEBUG: "RESPOSTA DO AXIOS",
        });
      }

      return res.json({
        DEBUG: "DATA nao existe na RESPOSTA DO AXIOS",
      });
    })
    .catch((error) => {
      return res.status(409).json(error.message);
    });
});

/* app.use((_, res) => {
  //  Retorna o arquivo que irá injetar o conteúdo do template

  res.sendFile("_document.html", { root: path.join(__dirname, "web/src") });
}); */

app.listen(process.env.PORT, () => {
  console.log(
    `Backend is running at: \x1b[35mhttp://localhost:${process.env.PORT}/\x1b[0m`
  );
});
