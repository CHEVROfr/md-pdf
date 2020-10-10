var puppeteer = require('puppeteer')
var tools = require("./tools")
var showdown  = require('showdown')
var showdownKatex  = require('showdown-katex')
var mime_ext = require('mimetype-extension')

converter = new showdown.Converter({
    tasklists: true,
    tables: true,
    openLinksInNewWindow: true,
    extensions: [
        showdownKatex({
          throwOnError: false,
          displayMode: false,
          errorColor: '#ff0000',
          delimiters: [
            { left: "$", right: "$", display: false },
            { left: '~', right: '~', display: false, asciimath: true },
          ]
        }),
    ]
})

exports.get = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        res.render("index.ejs", {})
    })
}

exports.post = (req, res) => {
    return new Promise((resolveP, rejectP) => {
        console.log("theme " + req.body.theme);
        console.log("variant " + req.body.variant);
        markdown_content = req.body.markdown_content

        markdown_html = '<!DOCTYPE HTML><html lang="fr"><head>'

        if(req.body.theme && req.body.theme == "github") {
            markdown_html +=    '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/github-markdown.css?v=1" />'
            
            if(req.body.variant && req.body.variant == "dark") {
                markdown_html += '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/github-markdown-dark-print.css?v=1" />'
            }
            else {
                markdown_html += '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/github-markdown-light-print.css?v=1" />'
            }        }
        else {
            markdown_html +=    '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/markdown.css?v=1" />'

            if(req.body.variant && req.body.variant == "dark") {
                markdown_html += '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/markdown-dark-print.css?v=1" />'
            }
            else {
                markdown_html += '<link rel="stylesheet" href="' + req.protocol + "://" + req.headers.host + '/files/css/markdown-light-print.css?v=1" />'
            }
        }

        markdown_html += '</head><body>'
        markdown_html += "<style>" + `/* FiraCode */
            @font-face {
                font-family: 'FiraCode';
                font-weight: normal;
                src: url(` + req.protocol + "://" + req.headers.host + `/files/font/FiraCode-Regular.woff2) format('woff2'),
                     url(` + req.protocol + "://" + req.headers.host + `/files/font/FiraCode-Regular.ttf)  format('truetype');
                font-style: normal;
            }
            /* FiraCode Bold */
            @font-face {
                font-family: 'FiraCode';
                font-weight: bold;
                src: url(` + req.protocol + "://" + req.headers.host + `/files/font/FiraCode-Bold.ttf)  format('truetype');
                font-style: normal;
            }` + "</style>"
        markdown_html +=    '<div class="markdown">' + converter.makeHtml(markdown_content) + '</div>'
        markdown_html += '</body>'

        let headerTemplate = '<style>#header, #footer { padding: 0 !important; }</style><div style="height: 100vh; width: 100%; background: #fff; -webkit-print-color-adjust: exact; margin: 0;"></div>'
        let footerTemplate = '<style>#header, #footer { padding: 0 !important; }</style><div style="height: 100vh; width: 100%; background: #fff; -webkit-print-color-adjust: exact; margin: 0;"></div>'

        if(req.body.variant && req.body.variant == "dark") {
            headerTemplate = '<style>#header, #footer { padding: 0 !important; }</style><div style="height: 100vh; width: 100%; background: #0d0d0d; -webkit-print-color-adjust: exact; margin: 0;"></div>'
            footerTemplate = '<style>#header, #footer { padding: 0 !important; }</style><div style="height: 100vh; width: 100%; background: #0d0d0d; -webkit-print-color-adjust: exact; margin: 0;"></div>'
        }

        puppeteer.launch({headless: true, args: ['--no-sandbox']}).then((browser) => {
            browser.newPage().then((page) => {
                page.setContent(markdown_html, {waitUntil: "networkidle2"}).then(() => {
                    page.pdf({
                        format: "A4",
                        margin: {
                            top: '0',
                            right: '0',
                            left: '0',
                            bottom: '0',
                        },
                        
                        printBackground: true,
                        headerTemplate: headerTemplate,
                        footerTemplate: footerTemplate,
                        displayHeaderFooter: true
                    }).then((buffer) => {
                        res.setHeader("Content-Type", mime_ext.get("pdf"))
                        res.setHeader('Content-Disposition', 'attachment; filename=' + tools.slugify("pdf-generated") + '.pdf')
                        res.send(buffer)
                    }).finally(() => {
                        browser.close()
                    })
                })                                                
            }) 
        })
    })
}