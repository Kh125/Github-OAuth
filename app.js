const { default: axios } = require("axios");
const express = require("express");
const path = require("path");

// Client Secret Obtain from Github OAuth App
const CLIENT_SECRET = "1234";

// Client ID Generated from Github OAuth App
const CLIENT_ID = "123";
var scope = "scope=user%20repo";

const app = express();

app.get("/", (req, res) => {
  return res.sendFile(path.join(__dirname, "/public/index.html"));
});

app.get("/auth", (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=Ov23liMkIR2qNM7AAPYV&${scope}`
  );
});

app.get("/callback", async (req, res) => {
  const response = await axios.post(
    "https://github.com/login/oauth/access_token",
    {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code: req.query.code,
    },
    {
      headers: {
        Accept: "application/json",
      },
    }
  );

  const token = response.data?.access_token;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  repoRes = await axios.get("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${token}`,
    },
  });

  return res.send(repoRes.data);
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
