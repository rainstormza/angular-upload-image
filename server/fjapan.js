
// var config = {
//     user: 'armiieza_SQLLogin_1',
//     password: 'tattey7zb5',
//     server: 'kibitoweb.mssql.somee.com', // You can use 'localhost\\instance' to connect to named instance
//     database: 'kibitoweb'
// }
var encoding = require('encoding-japanese');
var japan =  function (str){
  var detected = encoding.detect(str);
     var unicodeArr = encoding.convert(str, {
       to: 'SJIS',
       from: 'UNICODE'
     });
     return unicodeArr ;
}
// var config = {
//     user: 'sa',
//     password: 'trytex',
//     server: '172.17.170.125', // You can use 'localhost\\instance' to connect to named instance
//     database: 'kibito_web'
// }

module.exports = {
  japan
};
