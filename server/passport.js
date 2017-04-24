var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var sql = require('mssql');
var config = require('./db_config');

module.exports = function(passport) {
  var opts = {}
  opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
  opts.secretOrKey = 'secret';
  // opts.issuer = "accounts.examplesoft.com";
  // opts.audience = "yoursite.net";
  passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
      console.log(jwt_payload);
      var conn = new sql.Connection(config);
      var id = jwt_payload.id;
      var password = jwt_payload.password;
      conn.connect().then(function() {
          var request = new sql.Request(conn);
          request.input('id', sql.VarChar, id);
          request.input('password', sql.VarChar, password);
          request.query("SELECT * FROM M_STAFF WHERE loginid = @id AND login_pw = @password ").then(function(recordset) {
                // console.log(recordset);
                  if (recordset.length > 0) {
                      return done(null, recordset);
                  } else {
                      return done(null, false);
                  }
                  conn.close();
              })
              .catch(function(err) {
                  return done(err, false);
                  conn.close();
              });
      });
      // User.findOne({id: jwt_payload.sub}, function(err, user) {
      //     if (err) {
      //         return done(err, false);
      //     }
      //     if (user) {
      //         done(null, user);
      //     } else {
      //         done(null, false);
      //         // or you could create a new account
      //     }
      // });
  }));
}
