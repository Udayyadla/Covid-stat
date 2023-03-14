const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const port = 8080;

// Parse JSON bodies (as sent by API clients)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
const data = require("./data");
const { connection } = require("./connector");
app.get("/totalRecovered", async (req, res) => {
  try {
    const data = await connection.find();
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].recovered;
      //console.log(data[i].recovered);
    }
    res.status(200).json({
      data: { _id: "total", recovered: total },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
});
app.get("/totalActive", async (req, res) => {
  try {
    const data = await connection.find();
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      let active = data[i].infected - data[i].recovered;
      total += active;
      //console.log(data[i].recovered);
    }
    res.status(200).json({
      data: { _id: "total", Active: total },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
});
app.get("/totalDeath", async (req, res) => {
  try {
    const data = await connection.find();
    let total = 0;
    for (let i = 0; i < data.length; i++) {
      total += data[i].death;
    }
    res.status(200).json({
      data: { _id: "total", deaths: total },
    });
  } catch (err) {
    res.status(500).json({
      status: "Failed",
      message: err.message,
    });
  }
});
app.get("/hotspotStates", async (req, res) => {
  try {
    const data = await connection.find();
    const states = [];
    let rate,infectedCases,recoveredCases;
    for (let i = 0; i < data.length; i++) {
         infectedCases = data[i].infected;
        recoveredCases = data[i].recovered;
        rate = (infectedCases - recoveredCases) / infectedCases;
        if (rate > 0.1) {
            //{data: [{state: "Maharashtra", rate: 0.17854}, {state: "Punjab", rate: 0.15754}]}.
            states.push({ state: data[i].state, rate: rate.toFixed(5) })
        }
    }
    res.status(200).json({
      data: states,
    });
  } catch (error) {
    res.status(500).json({
      sta: "failed",
      message: error.message,
    });
  }
});
app.get("/healthyStates", async (req, res) => {
    try {
      const data = await connection.find();
      const states = [];
      let mortality,infectedCases,deathCases;
      for (let i = 0; i < data.length; i++) {
           infectedCases = data[i].infected;
          deathCases = data[i].death;
          mortality = deathCases/infectedCases
          if (mortality< 0.005) {
              //{data: [{state: "Maharashtra", rate: 0.17854}, {state: "Punjab", rate: 0.15754}]}.
              states.push({ state: data[i].state, mortality: mortality.toFixed(5) })
          }
      }
      res.status(200).json({
        data: states,
      });
    } catch (error) {
      res.status(500).json({
        sta: "failed",
        message: error.message,
      });
    }
  });

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
