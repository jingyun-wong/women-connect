const path = require('path');
const express = require('express');

const app = express();
// const publicPath = path.join(__dirname, '..', 'build');
const port = process.env.PORT || 3000;

app.use(express.static("build"));

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname,  "build", "index.html"));
});

app.listen(port, () => {
    console.log('Server is up!');
});