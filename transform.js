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
const node_fetch_1 = require("node-fetch");
var connection = null;
let index = -1;
let rows = null;
function setConnection(conn) {
    connection = conn;
}
exports.setConnection = setConnection;
var objectKeys = {
    "arkiv_kort_id": {
        "type": "integer",
        "store": true
    },
    "mediagruppe_enhets_id": {
        "type": "integer"
    },
    "tilvekstnr": {
        "type": "keyword",
        "store": true
    },
    "foto_mediagruppe": {
        "type": "integer"
    },
    "gjenstand": {
        "type": "keyword",
        "store": true
    },
    "spes_betegnelse": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "type_funksjon": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "datering": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "brukssted": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "prodsted": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "navn": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "materiale": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "teknikk": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "form_stil": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "farge": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "dekor_teknikk": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "dekor_motiv": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "innskr": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "stempel_sign": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "mÅl_vekt": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "tilstand": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "gjenstand_orig": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "spes_betegnelse_orig": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "type_funksjon_orig": {
        "type": "text",
        "analyzer": "norwegian"
    },
    "alle_data": {
        "type": "text",
        "fielddata": true,
        "analyzer": "standard"
    }
};
function loadResultset(sql) {
    return __awaiter(this, void 0, void 0, function* () {
        let query = yield connection.query(sql);
        rows = new Array();
        for (var key in objectKeys)
            console.log(key);
        var k = "gjenstand";
        //  console.log(JSON.stringify(query.rows[0],null,2));
        console.log(query.rows[0][k]);
        for (var temp = 0; temp < query.rows.length; temp++) {
            var row = query.rows[temp];
            var extractedRow = new Object();
            for (var key in objectKeys) {
                if (row[key] != null)
                    extractedRow[key] = row[key];
            }
            rows.push(extractedRow);
        }
        console.log(JSON.stringify(rows, null, 2));
        /*
        console.log("write to index " + rows.length);
        await writeToIndex(0);
      */
    });
}
exports.loadResultset = loadResultset;
function writeToIndex(index) {
    return __awaiter(this, void 0, void 0, function* () {
        if (index >= rows.length) {
            console.log("FINISH");
            return;
        }
        var formData = new Object();
        formData.elasticdata = JSON.stringify(rows[index], null, 2);
        //  formData.elasticdata = rows[index];
        formData.id = "";
        var bodyContent = JSON.stringify(formData);
        try {
            const result = yield node_fetch_1.default('http://itfds-utv01.uio.no/morten/es/test.php', {
                //     const result = await fetch('http://itfds-prod03.uio.no/es/BilledUpdate.php', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json, text/plain ',
                    'Content-type': 'application/json'
                },
                body: bodyContent
            });
            var answer = yield result.text();
            console.log(answer);
            //    await writeToIndex(index+1);
        }
        catch (error) {
            console.log("error: " + error);
        }
    });
}
/*
function writeToNajaxIndex(index){
  if (index >= rows.length) {
    console.log("FINISH");
    return;
  }
  var formData:any = new Object();
  formData.elasticdata = JSON.stringify(rows[index], null, 2);
  formData.id = "";
  najax({ url: 'http://itfds-prod03.uio.no/es/BilledUpdate.php',
          type: 'POST',
          data:formData,
          success: function (data) {
             console.log(data);
//             writeToNajaxIndex(index+1);
          }
});
}
*/ 
//# sourceMappingURL=transform.js.map