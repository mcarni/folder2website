const fs = require('fs');
const path = require('path');
// added also yaml support
const YAML = require('yaml');

// started from this
// https://stackoverflow.com/questions/11194287/convert-a-directory-structure-in-the-filesystem-to-json-with-node-js
// add log (possibly for errors and general info)
// do major cleanup
// see if recursive functions could help

const folder2js = (folder , depth , jsonFile) => {
  
  const stats = fs.lstatSync(folder);
  //console.log(JSON.stringify(stats,null,2));
  
  
  const structure = {
    "content" : {},
    "navbar" : {}
  };
  
  // define empty lang / cont objects
  //let lang = {};
  //let cont = {};

  
  // ################################
  // cycle through the subfolders which will become our languages
  // generate a temp array which will include all findings
  const languagesTemp = fs.readdirSync(folder);
  const languages = [];
  // remove spurious items that are not folders --> not languages
  languagesTemp.forEach((element,index) => {
    let languagePath = (__dirname + "/" + path.basename(folder) + "/" + element)
    let languagesStats = fs.lstatSync(languagePath);
    let isDir = languagesStats.isDirectory();
    if ( isDir && element.length == 2 ) {
      languages.push(element);
      console.log("added Language folder: " + element);
      } else {
        console.log("discarded element - NOT a Language folder: " + element)
      };
  });

  // #################################
  // go one level deeper (folder -1) and cycle through
  // the folders will be our webpages
  const webpagesTemp = [];
  const webpages = [];
  languages.forEach((langElement,langIndex) => {
    webpages[langIndex] = [];
    webpagesTemp[langIndex] = fs.readdirSync(folder + "/" + langElement);
    // remove spurious items that are not folders --> not webpages
    webpagesTemp[langIndex].forEach((pageElement,pageIndex) => {
      const webpagePath = (folder + "/" + langElement + "/" + pageElement);
      const webpagesStats = fs.lstatSync(webpagePath);
      const isDir = webpagesStats.isDirectory();
      if (isDir) {
        webpages[langIndex].push(pageElement);
        console.log("added Webpage folder: " + pageElement);
      } else {
        console.log("discarded element - NOT a Webpage folder: " + pageElement)
      };
    });
  });
  
  // #################################
  // go one more level (folder -2) and cycle through
  // txt files will be the content of our webpages or nav/title/menu/icon etc.
  let contents = [];
  languages.forEach((langElement,langIndex) => {
    // define empty lang / cont objects
    contents[langIndex] = [];
    pag = {};
    nav = {};
    
    webpages[langIndex].forEach((pageElement,pageIndex) => {
        cont = {};
        nav[pageElement] = {};
        const webpagePath = (folder + "/" + langElement + "/" + pageElement);
        contents[langIndex][pageIndex] = fs.readdirSync(webpagePath);
        contents[langIndex][pageIndex].forEach((contentElement,contentIndex) => {
          const contentsPath = (__dirname + "/" + path.basename(folder) + "/" + langElement + "/" + pageElement + "/" + contentElement);
          const contentsStats = fs.lstatSync(contentsPath);
          const isFile = contentsStats.isFile();
          const isDir = contentsStats.isDirectory();
          if (isFile) {
            const ext = getExt(contentElement);
            const text = readText(contentsPath);
            const yamlText = readYaml(contentsPath);
            if (ext == "txt") {
              switch (contentElement) {
                case "icon.txt":
                  cont["icon"] = text;
                  nav[pageElement]["icon"] = text;
                  break;
                case "nav.txt":
                  cont["nav"] = text;
                  nav[pageElement]["nav"] = text;
                  break;
                case "menu.txt":
                  cont["menu"] = text;
                  nav[pageElement]["menu"] = text;
                  break;
                case "title.txt":
                  cont["title"] = text;
                  break;
                default:
                  cont[contentElement] = text;
              };
            } else if (ext == "json") {
              const json = JSON.parse(text);
              cont[contentElement] = json;
            } else if (ext == "yaml") {
              const json = YAML.parse(yamlText);
              cont[contentElement] = json;
            } else {
              console.log("discarded element - file with wrong extension - not a Content element: " + contentElement);
            };

          } else if (isDir) {
            // ignore spurious items that are not files --> not content
            console.log("discarded element - misplaced folder - not a Content element: " + contentElement)
          };
          //console.log("cont : " + JSON.stringify(cont, null, 2));
        });
        pag[pageElement] = cont;
    });
    
    // let's pseudo-sort navbar elements based on their "nav" value
    Object.keys(nav).forEach((pageElement,pageIndex) => {
      // generate a new object with "key" matching the value of "nav"
      let navElement = nav[pageElement]["nav"].toString();
      let obj = {[navElement] : nav[pageElement]};
      // now we can remove the "nav" key/value pair from the navbar object
      delete nav[pageElement]["nav"];
      // generate a new key/value with the name of the page under the new object
      Object.assign(obj[navElement] , {"name" : pageElement});
      // assign the new object to the navbar
      Object.assign(nav , obj);
      // remove the page from the navbar (as it is under its "nav" now)
      delete nav[pageElement];
    });
    
    structure.content[langElement] = pag;
    structure.navbar[langElement] = nav;
  });
  
  fs.open(jsonFile, "w", function(err) {
    if(!err) {
      fs.writeFileSync(jsonFile, JSON.stringify(structure, null, 2), function (err) {
    })}; 
  });
  
  
  return structure;
  
};

function getExt(file) {
  // regular expression to get file extension
  const re = /(?:\.([^.]+))?$/;
  let ext = re.exec(file)[1];
  return ext;
}

  

function readText(file) {
    let text = fs.readFileSync(file, 'utf8');
    // remove all newline characters in the string
    text = text.replace(/\n|\r/g,'')
    return text;
}

function readYaml(file) {
    let text = fs.readFileSync(file, 'utf8');
    // remove all newline characters in the string
    //text = text.replace(/\n|\r/g,'')
    return text;
}



module.exports = { folder2js };



  
