var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fjapan = require('../fjapan');

const passport = require('passport');
var jwt = require('jsonwebtoken');

router.get('/api/test', passport.authenticate('jwt', {session:false}), function(req, res) {
  res.send('test and jwt works :)');
  // res.json({id: req.id});
});

/*API login*/
router.post('/api/login', function(req, res) {

    var conn = new sql.Connection(config);
    var id = fjapan.japan(req.body.id);
    var password = fjapan.japan(req.body.password);
    conn.connect().then(function() {
        var request = new sql.Request(conn);
        request.input('id', sql.VarChar, id);
        request.input('password', sql.VarChar, password);
        request.query("SELECT * FROM M_STAFF WHERE loginid = @id AND login_pw = @password ").then(function(recordset) {
              // console.log(recordset);
                if (recordset.length > 0) {
                  // jwt.sign(payload, secretOrPrivateKey, options, [callback])

                    // req.session.username = recordset[0].loginid;
                    // console.log(req.session);

                    var token = jwt.sign(
                      {
                        id:recordset[0].loginid,
                        password:recordset[0].login_pw
                      },
                        'secret',
                      {
                        expiresIn: 60000 // second
                      }
                    );
                    console.log(token);
                    // var text = '{"logIn_Success":"true"}';
                    var text = {"logIn_Success":true,"token":'JWT '+token};

                } else {
                    var text = {"logIn_Success":false};
                }
                res.json(text);
                conn.close();
            })
            .catch(function(err) {
                console.log(err);
                conn.close();
            });
    });
});
/*API login End*/

//api staff
/*Select*/
router.post('/api/staff_select', function(req, res) {
    var conn = new sql.Connection(config);
    var loginid = fjapan.japan(req.body.loginid);
    var login_pw = fjapan.japan(req.body.login_pw);
    // console.log(loginid);
    // console.log(login_pw);
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('loginid', sql.VarChar, loginid);
        req.input('login_pw', sql.VarChar, login_pw);

        if (loginid && login_pw) {
            str_sql = "SELECT * FROM M_STAFF WHERE loginid =@loginid AND login_pw = @login_pw ";

            req.query(str_sql).then(function(recordset) {

                    if (recordset.length > 0) {
                        var text = {
                            STAFF: true
                        };
                        res.json(text);
                        console.log(text);
                    } else {
                        var text = {
                            STAFF: false
                        };
                        res.json(text);
                    }

                    conn.close();
                })
                .catch(function(err) {
                    console.log(err);
                    conn.close();
                });
        } else {
            var text = [{
                "STAFF": "false"
            }];
            res.json(text);
        }

    });
});
/*End Select*/
/*Update*/

router.post('/api/staff_update', function(req, res) {
    var conn = new sql.Connection(config);

    var staff_id = fjapan.japan(req.body.staff_id);
    var str_sql;
    var loginid = fjapan.japan(req.body.loginid);
    var login_pw = fjapan.japan(req.body.login_pw);
    var name = fjapan.japan(req.body.name);
    var del_flag = req.body.del_flag;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('staff_id', sql.VarChar, staff_id);
        req.input('loginid', sql.VarChar, loginid);
        req.input('login_pw', sql.VarChar, login_pw);
        req.input('name', sql.VarChar, name);
        req.input('regis_date', sql.VarChar, 'GETDATE()');
        req.input('upd_date', sql.VarChar, 'GETDATE()');
        req.input('del_flag', sql.Int, del_flag);
        str_sql = "UPDATE M_STAFF SET " +
            "loginid=@loginid" +
            ",login_pw=@login_pw" +
            ",name=@name" +
            ",del_flag=@del_flag" +
            ",upd_date=GETDATE()" +
            "  WHERE staff_id=@staff_id";

        req.query(str_sql).then(function(recordset) {
                var text = { staff_Update :true};
                console.log(text);
                res.json(text);
                conn.close();
            })
            .catch(function(err) {
                console.log(err);
                conn.close();
            });
    });
});

/*End Update*/

module.exports = router;
