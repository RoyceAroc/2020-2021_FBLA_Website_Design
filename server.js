'use strict';

var easyrtc = require('open-easyrtc');
var express = require('express');
var fs = require('fs');
var Handlebars = require('handlebars');
var io = require('socket.io');
var nconf = require('nconf');
const http = require('http');
const path = require("path");
const app = express();
const port = process.env.PORT || "8080";
const { parse } = require('querystring');
const { Connection, Request } = require("tedious");
var webServer = null;
var fs = require('fs');
var tubertcApp = express();

const config = {
  authentication: {
    options: {
      userName: "edwardsdb", 
      password: "TeamR0cket!" 
    },
    type: "default"
  },
  server: "edwardsdb.database.windows.net", 
  options: {
    database: "dbchris", 
    encrypt: true
  }
};
const connection = new Connection(config);


connection.on("connect", err => {
  if (err) {
    console.error(err.meCssage);
  } else {
   // queryDatabase();
  }
});

function queryDatabase() {
  console.log("Reading rows from the Table...");

  // Read all rows from table
  const request = new Request(
    `SELECT * FROM IdentityOfIndividual WHERE (Username = 'RoyceB' OR Email = 'royceaden@gmail.com') AND Credentials = '12345678910'`,
    (err, rowCount) => {
      if (err) {
        console.error(err.message);
      } else {
        cool= `${rowCount} row(s) returned`;
      }
    }
  );
  request.on("row", columns => {
    columns.forEach(column => {
      console.log("%s\t%s", column.metadata.colName, column.value);
    });
  });
  connection.execSql(request);
 
}



tubertcApp.get("/", (req, res) => {
  fs.readFile('files/index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});
tubertcApp.get("/portfolio", (req, res) => {
  fs.readFile('files/portfolio.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});
tubertcApp.get("/about", (req, res) => {
  fs.readFile('files/about.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});
tubertcApp.get("/reserve", (req, res) => {
  fs.readFile('files/reserve.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});
tubertcApp.get("/pricing", (req, res) => {
  fs.readFile('files/pricing.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});
tubertcApp.get("/contact", (req, res) => {
  fs.readFile('files/contact.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});


tubertcApp.get('/components/index.css',function(req,res){
  res.sendFile(path.join(__dirname + '/components/index.css')); 
});
tubertcApp.get('/components/files.css',function(req,res){
  res.sendFile(path.join(__dirname + '/components/files.css')); 
});
tubertcApp.get('/components/contact.css',function(req,res){
  res.sendFile(path.join(__dirname + '/components/contact.css')); 
});
tubertcApp.get('/components/central.css',function(req,res){
  res.sendFile(path.join(__dirname + '/components/central.css')); 
});
tubertcApp.get('/components/all.css',function(req,res){
  res.sendFile(path.join(__dirname + '/components/all.css')); 
});
tubertcApp.get('/files/graphics/*',function(req,res){
  try {
    if (fs.existsSync('.' + req.originalUrl)) {
      res.sendFile(path.join(__dirname + req.originalUrl)); 
    }
  } catch(err) {
    fs.readFile('files/404.htm', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      return res.end();
    });
  }
});

tubertcApp.get('/components/script.js',function(req,res){
  res.sendFile(path.join(__dirname + '/components/script.js')); 
});
tubertcApp.get('/components/languages.json',function(req,res){
  res.sendFile(path.join(__dirname + '/components/languages.json')); 
});
// Try to find configuring files in the following places (in order)
//   1. Command-line arguments
//   2. Environment variables
//   3. settings.json file
nconf.argv()
     .env()
     .file({ file: 'settings.json' });

// Web application setup (for setting up routes)

// Load index.html template
var indexSource = fs.readFileSync(__dirname + '/templates/index.html', 'utf8');
var indexTmpl = Handlebars.compile(indexSource);

// Set up web servers according to configuration file

// By default, debugMode is on. Deployment requires the existence of a settings.json
// configuration file
var debugMode = nconf.get('debug');
if (debugMode === undefined) {
    debugMode = true;
}

// By default, if debugMode is enabled, AudioMeter is enabled.
var enableAudioMeter = nconf.get('enableAudioMeter');
if (enableAudioMeter === undefined) {
    if (debugMode) {
        enableAudioMeter = true;
    } else {
        enableAudioMeter = false;
    }
}

// Set up routes for static resources
tubertcApp.use('/js', express.static(__dirname + '/public/js'));
tubertcApp.use('/css', express.static(__dirname + '/public/css'));
tubertcApp.use('/audio', express.static(__dirname + '/public/audio'));
tubertcApp.use('/images', express.static(__dirname + '/public/images'));

// Add a route for telemetry scripts
if (debugMode) {
    tubertcApp.use('/telemetry', express.static(__dirname + '/public/telemetry'));
}

// Set up main index page (this changes depending on whether or not debugging is enabled in settings.json).
tubertcApp.get('/appointment', function(req, res) {
    var pageTitle = 'tubertc';
    var extraScripts = '';

    // If debug mode is enabled, load our debugging script (and add [debug] in the title)
    if (debugMode) {
        pageTitle += ' [debug]';
        extraScripts = '<script type="text/javascript"  src="/telemetry/debug.js"></script>';
    }

    if (enableAudioMeter) {
        pageTitle += '+am';
        extraScripts += '<script type="text/javascript" src="/js/audiometer.js"></script>';
    }

    res.send(indexTmpl({
        title: pageTitle,
        debugBody: extraScripts
    }));
});

// By default the listening server port is 8080 unless set by nconf or Heroku
var serverPort = process.env.PORT || nconf.get('port') || 8080;

// By default, HTTP is used
var ssl = nconf.get('ssl');

if (ssl !== undefined && ssl.key !== undefined && ssl.cert !== undefined) {
    webServer = require('https').createServer(
        {
            key: fs.readFileSync(ssl.key),
            cert: fs.readFileSync(ssl.cert)
        },
        tubertcApp
    ).listen(serverPort);
} else {
    webServer = require('http')
        .createServer(tubertcApp)
        .listen(serverPort);
}

// Set log level according to debugMode, on production, log level is on error only
var ioOpts;
if (debugMode) {
    ioOpts = { 'log level': 3 };
} else {
    ioOpts = { 'log level': 0 };
}

var socketServer = io.listen(webServer, ioOpts);

// Set up easyrtc specific options
easyrtc.setOption('demosEnable', false);
easyrtc.setOption('updateCheckEnable', false);

// If debugMode is enabled, make sure logging is set to debug
if (debugMode) {
    easyrtc.setOption('logLevel', 'debug');
}

// Use appIceServers from settings.json if provided. The format should be the same
// as that used by easyrtc (http://easyrtc.com/docs/guides/easyrtc_server_configuration.php)
var iceServers = nconf.get('appIceServers');
if (iceServers !== undefined) {
    easyrtc.setOption('appIceServers', iceServers);
} else {
    easyrtc.setOption('appIceServers', [
        {
            url: 'stun:stun.l.google.com:19302'
        },
        {
            url: 'stun:stun.sipgate.net'
        },
        {
            url: 'stun:217.10.68.152'
        },
        {
            url: 'stun:stun.sipgate.net:10000'
        },
        {
            url: 'stun:217.10.68.152:10000'
        }
    ]);
}

easyrtc.listen(tubertcApp, socketServer);
/*
tubertcApp.get('*', function(req, res){
  fs.readFile('files/404.htm', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
});*/


tubertcApp.post('/check', function (req, res) {
var ans = "";
  req.on('data', function(data) {
    var obj = JSON.parse(data);
    const requestC= new Request(
      `SELECT ScopeCode FROM IdentityOfIndividual WHERE (Username = '` + obj.Unknown +  `' OR Email = '` + obj.Unknown +  `') AND Credentials = '` + obj.Password +  `'`,
      (err, rowCount) => {
        if (err) {
          console.error(err.message);
        } else {
            ans = `${rowCount}`;     
            if(ans == 0) {
              res.send("false");
            }
        }
      }
    );
      requestC.on("row", columns => {
        res.send(columns[0].value);
      });
     
    connection.execSql(requestC);
  })
});
tubertcApp.post('/registration', function (req, res) {
  /* We left off here on the registration phase*/
  var ans = "";
    req.on('data', function(data) {
      var obj = JSON.parse(data);
      const requestA= new Request(
        `INSERT INTO IdentityOfIndividual
         VALUES ('` + obj.Key + `', '` + obj.Username + `', '` + obj.Email + `', '` + obj.Password + `');`,
        (err, result) => {
          if (err) {
            console.error(err.message);
          } else {
              ans = `${result}`;     
              res.send(ans);
          }
        }
      );     
    connection.execSql(requestA);
    })
  });
  tubertcApp.post('/readLanguage', function (req, res) {
    /* We left off here on the registration phase*/
      req.on('data', function(data) {
        fs.readFile('languages.json', function(err, data) {
         // res.writeHead(200, {'Content-Type': 'text/html'});
          res.send(data);
          return res.end();
        });
      })
    });
      var arr = [];
      var objectData = new Object();
      tubertcApp.post('/calendarbookings', function (req, res) {
        /* We left off here on the registration phase*/
          req.on('data', function(data) {
            const requestB = new Request(
              `SELECT * FROM bookacall;`,
              (err, result) => {
                if (err) {
                  console.error(err.message);
                } 
              }
            );
            requestB.on("row", row => {
              //We might do row processing for memory management...
              row.forEach(column => {
                arr.push(column.value);
              });
            });
            requestB.on('doneProc', result => {
              res.send(arr);
              arr = [];
            });
           connection.execSql(requestB);
          })
        });
