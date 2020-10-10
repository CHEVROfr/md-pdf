var configs = require("../configs/configs")
var mime_ext = require('mimetype-extension')

exports.slugify = (str) => {
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.toLowerCase();
    
    str = str.replace("'", "-")
    str = str.replace("’", "-")
    str = str.replace('"', "-")
    
    // remove accents, swap ñ for n, etc
    var from = "àáãäâèéëêìíïîòóöôùúüûñç";
    var to   = "aaaaaeeeeiiiioooouuuunc";
  
    for (var i=0, l=from.length ; i<l ; i++) {
        str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }
    
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
          .replace(/\s+/g, '-') // collapse whitespace and replace by -
          .replace(/-+/g, '-'); // collapse dashes
    
    return str
}

exports.sendErrors = (errorNum, req, res, redirect="") => {
    switch(errorNum) {
        case "301":
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.status(301)
            res.redirect(redirect)
            break;
        case "403":
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.status(403)
            res.render('error.ejs', { 
                appTitleRedirect: "/",
                redirect: "/",
                redirectText: "RETOUR À L'ACCUEIL",
                errorText: "Forbidden",
                errorCode: "403"
            })
            break;
        default:
            res.setHeader("Content-Type", mime_ext.get("html"))
            res.status(404)
            res.render('error.ejs', { 
                appTitleRedirect: "/",
                redirect: "/",
                redirectText: "RETOUR À L'ACCUEIL",
                errorText: "File Not Found",
                errorCode: "404"
            })
            break;
    }
}