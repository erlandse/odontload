import * as path from 'path';

import * as express from "express";
import * as bodyParser from "body-parser";
import * as tools from './tools';
import * as transform from './transform';
import * as pg from 'pg';
import * as fs from 'fs';
//import * as nf from 'node-fetch';

var app = express();
var result;
import * as  ejs from 'ejs';
import * as najax from 'najax';
var message = "";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", express.static(path.join(__dirname, 'public')));

let pgConn = null;



var server = app.listen(8081, function () {

  var host = server.address().address
  var port = server.address().port

//  console.log("Listening at http://%s:%s", host, port);
//  console.log(JSON.stringify(tools.dbConnection, null, 2));
  openConnection();
})

async function openConnection() {
  var pgPool = new pg.Pool(tools.dbConnection);
  const pgConn = await pgPool.connect();
  try {
    transform.setConnection(pgConn);
    await transform.loadResultset("select * from usd_odontologi.arkiv_kort where ferdig_registrert ='1'");
//    await transform.loadResultset("select * from usd_uio.hurtigsoek_data");
    
  } finally {
    pgConn.release();
    await pgPool.end();
    process.exit()

  }

}



app.get('/ServerClose', function (req, res) {
  console.log("kalder ServerClose");
  process.exit();
})



function run_cmd(cmd, args, callBack) {
/*  var spawn = require('child_process').spawn;
  var child = spawn(cmd, args);
  var resp = "";
  child.stdout.on('data', function (buffer) { resp += buffer.toString() });

  child.stdout.on('end', function () { callBack(resp) });*/
}

