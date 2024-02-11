import express from 'express';
import qr from 'qr-image';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post('/generate-qr', (req, res) => {
  const url = req.body.url;
  if (url) {
    // Generate QR code
    const qr_svg = qr.image(url, { type: 'png' });
    let chunks = [];
    qr_svg.on('data', (chunk) => {
      chunks.push(chunk);
    });
    qr_svg.on('end', () => {
      const base64 = Buffer.concat(chunks).toString('base64');
      const imgSrc = `data:image/png;base64,${base64}`;
      res.render('qr.ejs', { qr_code: imgSrc });
    });
  } else {
    res.send("Please enter a valid URL");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});