'use strict'

const fastify = require('fastify')
const Crypto={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(a){var b="",d,e,f,g,h,j,k,l=0;for(a=Crypto._utf8_encode(a);l<a.length;)d=a.charCodeAt(l++),e=a.charCodeAt(l++),f=a.charCodeAt(l++),g=d>>2,h=(3&d)<<4|e>>4,j=(15&e)<<2|f>>6,k=63&f,isNaN(e)?j=k=64:isNaN(f)&&(k=64),b=b+this._keyStr.charAt(g)+this._keyStr.charAt(h)+this._keyStr.charAt(j)+this._keyStr.charAt(k);return b},decode:function(a){var d,e,f,g,h,j,k,b="",l=0;for(a=a.replace(/[^A-Za-z0-9\+\/\=]/g,"");l<a.length;)g=this._keyStr.indexOf(a.charAt(l++)),h=this._keyStr.indexOf(a.charAt(l++)),j=this._keyStr.indexOf(a.charAt(l++)),k=this._keyStr.indexOf(a.charAt(l++)),d=g<<2|h>>4,e=(15&h)<<4|j>>2,f=(3&j)<<6|k,b+=String.fromCharCode(d),64!=j&&(b+=String.fromCharCode(e)),64!=k&&(b+=String.fromCharCode(f));return b=Crypto._utf8_decode(b),b},_utf8_encode:function(a){a=a.replace(/\r\n/g,"\n");for(var e,b="",d=0;d<a.length;d++)e=a.charCodeAt(d),128>e?b+=String.fromCharCode(e):127<e&&2048>e?(b+=String.fromCharCode(192|e>>6),b+=String.fromCharCode(128|63&e)):(b+=String.fromCharCode(224|e>>12),b+=String.fromCharCode(128|63&e>>6),b+=String.fromCharCode(128|63&e));return b},_utf8_decode:function(a){for(var b="",d=0,e=c1=c2=0;d<a.length;)e=a.charCodeAt(d),128>e?(b+=String.fromCharCode(e),d++):191<e&&224>e?(c2=a.charCodeAt(d+1),b+=String.fromCharCode((31&e)<<6|63&c2),d+=2):(c2=a.charCodeAt(d+1),c3=a.charCodeAt(d+2),b+=String.fromCharCode((15&e)<<12|(63&c2)<<6|63&c3),d+=3);return b}};
const TextObfuscator = require('text-obfuscator');

function isValidURL(str) {
    var pattern = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,'gm');
    return !!pattern.test(str);
}

function build () {
  const app = fastify({
    logger: true
  })

  app.get('/', async (req, res) => {
    return {statusCode:res.statusCode,message:'Welcome to ImgFo API.'}
  })

  app.post('/generate-link', async (req, res) => {
    const { body } = req;
    if(body && body.url) {
      if(Array.isArray(body.url)) {
       var urltest = true;
       if(body.url.length <= 0) urltest = false;
       for(var i =0; i< body.url.length;i++) {
         if(!isValidURL(body.url[i].trim())) {
           urltest = false;
         }
       }
       if(urltest) {
        var link = [];
        for(var x=0; x<body.url.length;x++) {
           link.push('https://imgfo.com/view?content='+encodeURIComponent(TextObfuscator.encode(Crypto.encode(body.url[x].trim()),3)));
        }
        return {statusCode:res.statusCode,message:'Generate link successfully!',response:{link:link}}
       } else {
        res.statusCode = 400;
        return {statusCode:res.statusCode,message:'One of links has an invalid URL!',response:{}}
       }
      } else {
        var url = body.url.trim();
        if(isValidURL(url)) {
            var link = encodeURIComponent(TextObfuscator.encode(Crypto.encode(url),3));
            return {statusCode:res.statusCode,message:'Generate link successfully!',response:{link:'https://imgfo.com/view?content='+link}}
        } else {
            res.statusCode = 400;
            return {statusCode:res.statusCode,message:'Invalid URL!',response:{}}
        }
      }
    } else {
        res.statusCode = 400;
        return {statusCode:res.statusCode,message:'Bad Request!',response:{}}
    }
  })

  app.post('/decode-content', async (req, res) => {
    const { body } = req;
    if(body && body.content) {
      var hashed = decodeURIComponent(body.content);
      var link = Crypto.decode(TextObfuscator.decode(hashed,3));
      return {statusCode:res.statusCode,message:'Decode content successfully!',response:{link:link}}
    } else {
        res.statusCode = 400;
        return {statusCode:res.statusCode,message:'Bad Request!',response:{}}
    }
  })

  return app
}

module.exports = build