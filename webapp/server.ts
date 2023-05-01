import express,{Application} from 'express'; 
import https from "https";
import "dotenv/config"
//for using an import here we need to configure the tsconfig.json
//setting the option module to commonjs
import path from 'path';
var app: Application = express()

let credentials = {key: process.env.REACT_APP_HTTPS_PRIVATEKEY, cert: process.env.REACT_APP_HTTPS_CERTIFICATE};
let httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, function() {
    console.log("Servidor HTTPS escuchando en puerto 443")
});

app.use(express.static('build'))

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});