import fetch from 'node-fetch';
var connection = null;
let index = -1;
let rows = null;



export function setConnection(conn) {
  connection = conn;
}
var objectKeys= {
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
  "alle_data":{
    "type":"text",
    "fielddata": true,          
    "analyzer":"standard"
  }
};



export async function loadResultset(sql: string) {
  let query = await connection.query(sql);
  rows = new Array();
  for (var temp = 0; temp < query.rows.length; temp++) {
    var row = query.rows[temp];
    var extractedRow = new Object();
    for(var key in objectKeys){
      if(row[key] != null)
        extractedRow[key] = row[key];
    }
    rows.push(extractedRow);
  }
  console.log(JSON.stringify(rows,null,2));
  /*
  console.log("write to index " + rows.length);
  await writeToIndex(0);
*/

}

async function writeToIndex(index) {
  if (index >= rows.length) {
    console.log("FINISH");
    return;
  }
  var formData: any = new Object();
  formData.elasticdata = JSON.stringify(rows[index], null, 2);
//  formData.elasticdata = rows[index];
  formData.id = "";
  var bodyContent = JSON.stringify(formData);
  try {
    const result = await fetch('http://itfds-utv01.uio.no/morten/es/test.php', {
//     const result = await fetch('http://itfds-prod03.uio.no/es/BilledUpdate.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/plain ',
        'Content-type': 'application/json'
        }, 
        body:bodyContent
    });
    var answer = await result.text();
    console.log(answer);
//    await writeToIndex(index+1);
  }
  catch (error) {
    console.log("error: " + error);
  }
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