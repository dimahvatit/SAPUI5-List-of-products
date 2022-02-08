const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

let port = process.env.PORT || 8081;

function getRandomNum(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

app.get('/orders', (req, res) => {
	res.json({ rand: getRandomNum(2, 15) });
});

app.get('/suppliers', (req, res) => {
	res.json({ rand: getRandomNum(-1, 3) });
});

app.listen(port);
console.log(`Server started at port: ${port}`);
