import express,{Application} from 'express'; 
//for using an import here we need to configure the tsconfig.json
//setting the option module to commonjs

import path from 'path';
var app: Application = express()

const port: number = 80;


app.use(express.static('build'))

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, ():void => {
    console.log('Webapp started on port '+ port);
}).on("error",(error:Error)=>{});