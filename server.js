const express = require('express')
const QRCode = require('qrcode')
const http = require('http');
const url = require('url'); 
const bodyParser = require('body-parser')

async function main() {
  // Azure App Service will set process.env.port for you, but we use 3000 in development.
  const PORT = process.env.PORT || 3000;

  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.get('/:text', async (req, res) =>{

    // Text
    let text = req.params.text;

    // Options :
    var opts = {
      errorCorrectionLevel: req.query.errorCorrectionLevel || 'H',
      type: req.query.type ||'image/png',
      width: req.query.width || 200,
      quality: req.query.quality || 0.3,
      margin: req.query.margin || 1,
      color: {
        dark: req.query.darkColor || "#010599FF",
        light: req.query.lightColor ||"#FFBF60FF"
      }
    }
    
    QRCode.toDataURL(text, opts, (err, url)=>{
      let data = url.replace(/.*,/,'');
      let img = new Buffer.from(data,'base64');
      res.writeHead(200,{
          'Content-Type' : opts.type,
          'Content-Length' : img.length
      })
      res.end(img)
    })

  });

  app.post('/api/generate', async (req, res) =>{

    let text = req.body.text;

    var opts = {
      errorCorrectionLevel: req.body.errorCorrectionLevel || 'H',
      type: req.body.type ||'image/png',
      width: req.body.width || 200,
      quality: req.body.quality || 0.3,
      margin: req.body.margin || 1,
      color: {
        dark: req.body.darkColor || "#010599FF",
        light: req.body.lightColor ||"#FFBF60FF"
      }
    }
    
    QRCode.toDataURL(text, opts, (err, url)=>{
        let data = url.replace(/.*,/,'');
        //console.log(data)
        let img = new Buffer.from(data,'base64');
        res.writeHead(200,{
            'Content-Type' : opts.type,
            'Content-Length' : img.length
        })
        res.end(img)
    })

  });

  // Create the HTTP server.
  let server = http.createServer(app);
  server.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
  });  

}

main()
