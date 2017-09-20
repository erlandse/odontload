"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const tools = require("./tools");
const transform = require("./transform");
const pg = require("pg");
//import * as nf from 'node-fetch';
var app = express();
var result;
var message = "";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/public", express.static(path.join(__dirname, 'public')));
let pgConn = null;
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    //  console.log("Listening at http://%s:%s", host, port);
    //  console.log(JSON.stringify(tools.dbConnection, null, 2));
    openConnection();
});
function openConnection() {
    return __awaiter(this, void 0, void 0, function* () {
        var pgPool = new pg.Pool(tools.dbConnection);
        const pgConn = yield pgPool.connect();
        try {
            transform.setConnection(pgConn);
            yield transform.loadResultset("select * from usd_odontologi.arkiv_kort where ferdig_registrert ='1'");
            //    await transform.loadResultset("select * from usd_uio.hurtigsoek_data");
        }
        finally {
            pgConn.release();
            yield pgPool.end();
            process.exit();
        }
    });
}
app.get('/ServerClose', function (req, res) {
    console.log("kalder ServerClose");
    process.exit();
});
function run_cmd(cmd, args, callBack) {
    /*  var spawn = require('child_process').spawn;
      var child = spawn(cmd, args);
      var resp = "";
      child.stdout.on('data', function (buffer) { resp += buffer.toString() });
    
      child.stdout.on('end', function () { callBack(resp) });*/
}
//# sourceMappingURL=Server.js.map