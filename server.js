const express = require("express")
const fs = require('fs')
const path = require('path')
const app = express()


app.use(express.static("files"))
app.use(express.urlencoded());
app.use(express.json());


app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});


app.get("/", function (req, res) {
   res.sendFile(path.join(__dirname, 'files/index.html'));
})

app.get("/info", function (req, res) {

    let rawdata = fs.readFileSync('files/data.json');
  	let codeInfo = JSON.parse(rawdata);
    res.send(codeInfo)

})



let listener = app.listen(process.env.PORT || 3000,
	() => console.log(`Server is running...${listener.address().port}`));
