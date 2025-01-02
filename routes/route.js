/* IT route */
// require and instantiate express
const express = require("express");

// and express-router
const router = express.Router();

const { structure } = require('../index.js');
// some debug... to be removed
//console.log("fsdfsdfsdf of Languages: " + Object.keys(structure.content).length);

// TODO implement that defaultLanguage is set in the general settings and added to structure.json
const defaultLanguage = "it";

// used to handle links in navbar when coming from root
let isRoot = false;

// router
// redirect for default language
router.get("/", (req, res) => {
    let defaultAddress = defaultLanguage + "/home"
    res.render(defaultAddress, {
      isRoot        : true,
      pageLanguage  : defaultLanguage,
      pageName      : "home",
      pageContent   : structure.content[defaultLanguage]["home"],
      siteNavbar    : structure.navbar,
      siteSettings  : structure.settings
    });
});

// router
// for all pages based on language and page parameter
router.get("/:languageId/:pageId", (req, res) => {
  
  let isLanguage = false;
  let isPage = false;
  
  // check if requested language/page exist
  Object.keys(structure.content).forEach((language,languagenumber) => {
    if (req.params.languageId == language) {
      isLanguage = true;
    //};
      Object.keys(structure.content[language]).forEach((page,pagenumber) => {
        if (req.params.pageId == page) {
          isPage = true;
        };
      });
    };
  });

  if ( isPage && isLanguage) {
    let address = req.params.languageId + "/" + req.params.pageId;
    res.render(address, {
      isRoot        : false,
      pageLanguage  : req.params.languageId,
      pageName      : req.params.pageId,
      pageContent   : structure.content[req.params.languageId][req.params.pageId],
      siteNavbar    : structure.navbar,
      siteSettings  : structure.settings
    });
  } else {
    res.render('pageNotFound', {
      //cont : structure.content[req.params.languageId][req.params.pageId]
    });
  };
  
});



module.exports = router;
