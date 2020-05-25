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

  app.get('/:qrcode', async (req, res) =>{
      //res.send('TEST')
      let text = req.params.qrcode;

      var opts = {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        quality: 0.3,
        margin: 1,
        color: {
          dark:"#010599FF",
          light:"#FFBF60FF"
        }
      }
      
      QRCode.toDataURL(text, opts, (err, url)=>{

          let data = url.replace(/.*,/,'');
          //console.log(data)
          let img = new Buffer.from(data,'base64');
          res.writeHead(200,{
              'Content-Type' : 'image/png',
              'Content-Length' : img.length
          })
          res.end(img)
      })

  });

  app.post('/qrcode',(req, res) =>{
    let text = req.body.text || 'test';
    let type = req.body.type || 'image/png';
    let margin = req.body.margin || 1;
    let quality = req.body.quality || 0.3;
    let darkcolor = req.body.darkcolor || '#010599FF';
    let lightcolor = req.body.lightcolor || '#FFBF60FF';

    var opts = {
      errorCorrectionLevel: 'H',
      type: type,
      quality: 0.3,
      margin: 1,
      color: {
        dark: darkcolor,
        light: lightcolor
      }
    }
    
    QRCode.toDataURL(text, opts, (err, url)=>{

        let data = url.replace(/.*,/,'');
        //console.log(data)
        let img = new Buffer.from(data,'base64');
        res.writeHead(200,{
            'Content-Type' : 'image/png',
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
