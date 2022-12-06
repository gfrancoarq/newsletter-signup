/* PASOS PARA SETEAR UN NUEVO PROYECTO CON NODE Y EXPRESS:
1- Se crea el proyecto y se crean los archivos necesarios: app.js y los html que se necesiten.
2- Hacemos npm init y luego instalamos paquetes necesarios npm install express body-parser request
3- Agregamos al archivo app.js lo marcado con "#Boilerplate app.js"
*/

/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars

// "#Boilerplate app.js"
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// 4- Esto es para configurar la ruta principal y recibir los datos
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const email = req.body.email;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };

  const jsonData = JSON.stringify(data);
  const url = "https://us17.api.mailchimp.com/3.0/lists/879ac69af2";
  const options = {
    method: "POST",
    auth: "gfrancoarq:g6085e7d74ad6a5e6b5926d0c9f8503d9-us17",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });

  request.write(jsonData);
  request.end();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});

// "#Boilerplate app.js"
// 6- Junto al puerto 3000, se pone un puerto dinámico, para poder hacer el deploy con Heroku. Esto ahora corre localmente, y tambien en Heroku. El objeto process está definido por Heroku.
app.listen(process.env.PORT || 3000, function () {
  console.log("listening on port 3000");
});

// API KEY Mailchimp
// 6085e7d74ad6a5e6b5926d0c9f8503d9-us17

// Audience ID
// 879ac69af2
