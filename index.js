/* index.js */

require('dotenv').config();

const fs = require('fs');
const path = require('path');

// TODO - add a log file, send echo's to log and not to console

// load our module to form a js object out of a folder structure
const { folder2js } = require('./folder2js.js');
// provide info on structure folder to be processed and desired output json file
const targetDir = './structure';
const outputFile = './structure/structure.json';
// launch folder2js on relevant target folder and generate appropriate json output
const structure = folder2js(targetDir , 0 , outputFile);

// export structure
module.exports = { structure };

// generate view folder according to json file
// starting dir = views
const viewDir = './views';
// let's define a default ejs to capture all page's content
const defaultEjs = '<h2>CONTENT</h2> \n \
<% Object.keys(pageContent).forEach((key,index) => { %> \n \
"index : "<%= index %> "key : " <%= key -%>  "value : "<%- JSON.stringify(pageContent[key], null, 2) %><br> \n \
<%  }); %> \n \
\n \
<h2>NAVBAR</h2> \n \
<% Object.keys(siteNavbar).forEach((key,index) => { %> \n \
"index : "<%= index %> "key : " <%= key -%>  "value : "<%- JSON.stringify(siteNavbar[key], null, 2) %><br> \n \
<%  }); %> \n \
\n \
<h2>PAGE INFO</h2> \n \
"Page Language :" <%= pageLanguage %> \n \
"Page Name :" <%= pageName %> \n \
';
// cycle through languages first then pages
Object.keys(structure.content).forEach((language,languagenumber) => {
  let languageDir = viewDir + '/' + language;
  if (!fs.existsSync(languageDir)) {
    fs.mkdirSync(languageDir, { recursive: true });
  };
  Object.keys(structure.content[language]).forEach((page,pagenumber) => {
    let pageFullName = languageDir + '/' + page + '.ejs';
    if (fs.existsSync(pageFullName)){
      pageFullName = pageFullName + '.default'
    };
    //let jsonOutput = '<%-  JSON.stringify(' + JSON.stringify(structure.content[language][page]) + ') %>';
    //let jsonOutput = '<%-  ' + JSON.stringify(structure.content[language][page]) + ' %>';
    // let jsonOutput = JSON.stringify(structure.content[language][page]);
    //let jsonOutput = JSON.stringify(structure.content[language][page]);
    //let jsonOutput = structure.content[language][page];
    //fs.writeFileSync(pageFullName, jsonOutput, 'utf8', (err) => {
    fs.writeFileSync(pageFullName, defaultEjs, 'utf8', (err) => {
      if (err) throw err;
      console.log('File ' + pageFullName + ' has been saved!');
    }); 
  });
}); 

// require and instantiate express
const express = require('express');
// do we need cookieparser, bodyparser and crypto?
const cookieParser = require('cookie-parser');
//const bodyParser = require('body-parser');
//const crypto = require('crypto');

// instantiate express
const app = express();

// tell express to use cookieParser
app.use(cookieParser())

// define local variables
app.locals.structure = structure;

// define the folder to serve with static content
app.use(express.static(__dirname + '/'));
// set the view engine to ejs
app.set('view engine', 'ejs')

// let's define different routes for different languages'
const mainRoute = require('./routes/route.js');
// and tell express to use the defined routes
app.use(mainRoute);

// initializes as a function handler for the HTTP server
const http = require('http').createServer(app);
// https://lamiaguidadibrescia.cyclic.app/

// -------------------------------------------------------------------
// run your application on PORT specified in env file
app.listen(process.env.PORT, () => {
    console.log("Server is running on port : " + process.env.PORT)
});


