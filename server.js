const express = require('express')
const app = express()
const QRCode = require('qrcode')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/:qrcode',(req, res) =>{
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

app.listen(1337)
