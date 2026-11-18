"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".css":"text/css; charset=utf-8", ".svg":"image/svg+xml", ".json":"application/json; charset=utf-8", ".png":"image/png"};
http.createServer((req,res) => {
    let name;
    try { name = decodeURIComponent(new URL(req.url,"http://localhost").pathname); }
    catch { res.writeHead(400).end(); return; }
    const file = path.resolve(root,"."+name+(name.endsWith("/")?"index.html":""));
    if (file !== root && !file.startsWith(root+path.sep)) { res.writeHead(403).end(); return; }
    fs.readFile(file,(error,content)=>{
        if(error) { res.writeHead(404,{"Content-Type":"text/plain"}).end("Not found"); return; }
        res.writeHead(200,{"Content-Type":types[path.extname(file)]||"application/octet-stream","Content-Length":content.length,"Cache-Control":"no-store"});
        res.end(content);
    });
}).listen(8767,"127.0.0.1",()=>console.log("Local: http://127.0.0.1:8767"));
