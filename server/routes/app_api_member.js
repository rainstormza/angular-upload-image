var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var config_var = require('../config_var');
var mediaPath = __dirname+'/';
var fs = require('fs');
var fjapan = require('../fjapan');
const nodemailer = require('nodemailer');
const passport = require('passport');
var jwt = require('jsonwebtoken');
// let transporter = nodemailer.createTransport(smtpTransport('SMTP',{
//    host: 'setouchi-sora.sakura.ne.jp',
//     auth: {
//         user: 'info@setouchi-soratoumi.com',
//         pass: 'user7777'
//     }
// });


var transporter = nodemailer.createTransport({
            host: 'setouchi-sora.sakura.ne.jp',
            port: 587,
            auth: {
              user: 'info@setouchi-soratoumi.com',
              pass: 'user7777'
            }
        });
function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}




/*API member*/
/*Select*/
router.post('/api/member', function(req, res) {
    var conn = new sql.Connection(config);
    var member_id = req.body.member_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('member_id', sql.Int, member_id);
        if (member_id) {
            str_sql = "SELECT * FROM M_MEMBER WHERE member_id =@member_id ";
        } else {
            str_sql = "SELECT * FROM M_MEMBER  ";
        }
        req.query(str_sql).then(function(recordset) {

          for(let i = 0 ; i<recordset.length ; i++){
            if(recordset[i]['member_image']){
                //console.log(mediaPath + '/member_image/'+recordset[i]['member_image']);

                  //load(mediaPath + '/member_image/'+recordset[i]['member_image']);
                recordset[i]['member_image_BASE64'] =   base64_encode(mediaPath + '/member_image/'+recordset[i]['member_image']);
                  // Then you'll be able to handle the myimage.png file as base64

            }
          }

        //  console.log(recordset);
          res.json(recordset);
          conn.close();

            })
            .catch(function(err) {
                console.log(err);
                conn.close();
            });
    });
});
/*End Select*/

/*Select email*/
router.post('/api/checkemail', function(req, res) {
    var conn = new sql.Connection(config);
    var member_mail_address = req.body.member_mail_address;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('member_mail_address', sql.VarChar, member_mail_address);
        if (member_mail_address) {
            str_sql = "SELECT member_mail_address , member_login_id FROM M_MEMBER WHERE member_mail_address =@member_mail_address    ";
        } else {
            str_sql = "";
        }
        req.query(str_sql).then(function(recordset) {
          if(recordset.length > 0){
          res.json({member_mail:true});
          }
          else{
            res.json({member_mail:false});
          }
          conn.close();

            })
            .catch(function(err) {
                console.log(err);
                conn.close();
            });
    });
});
/*End Select*/


/*Select resetpassword*/
router.post('/api/resetpassword', function(req, res) {

    var token = req.body.token;
    var member_login_password = req.body.member_login_password;
    var decoded = jwt.decode(token, { complete: true });
    var member_login_id = decoded.payload.member_login_id_member_kibito ;
    var member_mail_address = decoded.payload.email_member_kibito ;
    var iat = decoded.payload.iat ;
    var exp = decoded.payload.exp ;
    var date_now = Date.now()/ 1000 ;
  //  console.log(decoded);
  //   res.json(decoded);
    if(date_now<=exp){
        var conn = new sql.Connection(config);
        var str_sql;
        conn.connect().then(function () {
          var req = new sql.Request(conn);
                    req.input('member_login_password', sql.VarChar, member_login_password);
                    req.input('member_mail_address', sql.VarChar, member_mail_address);
                    req.input('member_login_id', sql.VarChar, member_login_id);
                    req.input('upd_date', sql.VarChar, 'GETDATE()');
                     str_sql = "UPDATE M_MEMBER SET "+
                     "member_login_password=@member_login_password"+
                     ",upd_date=GETDATE()"+
                     "  WHERE member_login_id=@member_login_id and member_mail_address=@member_mail_address" ;

          req.query(str_sql).then(function(recordset) {
               var text = {resetpassword:true};
            console.log(text);
           res.json(text);
            conn.close();
          })
          .catch(function(err) {
            console.log(err);
            conn.close();
          });
        });
    }
    else{
     res.json({has_expired:true});
    }


    // conn.connect().then(function() {
    //     var req = new sql.Request(conn);
    //     req.input('member_mail_address', sql.VarChar, member_mail_address);
    //     if (member_mail_address) {
    //         str_sql = "SELECT member_mail_address , member_login_id FROM M_MEMBER WHERE member_mail_address =@member_mail_address  ";
    //     } else {
    //         str_sql = "";
    //     }
    //     req.query(str_sql).then(function(recordset) {
    //       if(recordset.length > 0){
    //       res.json(recordset);
    //       }
    //       else{
    //         res.json({member_mail_address:'NULL',member_login_id:'NULL'});
    //       }
    //       conn.close();
    //
    //         })
    //         .catch(function(err) {
    //             console.log(err);
    //             conn.close();
    //         });
    // });

});
/*End resetpassword*/

/*forget_password*/
router.post('/api/forget_password', function(req, res) {
    var conn = new sql.Connection(config);
    var member_mail_address = req.body.member_mail_address;

    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('member_mail_address', sql.VarChar, member_mail_address);
        if (member_mail_address) {
            str_sql = "SELECT member_mail_address , member_login_id , member_name FROM M_MEMBER WHERE member_mail_address =@member_mail_address  ";
        } else {
            str_sql = "";
        }
        req.query(str_sql).then(function(recordset) {
           if(recordset.length > 0){
          var token = jwt.sign(
            {
              email_member_kibito:recordset[0].member_mail_address,
              member_login_id_member_kibito:recordset[0].member_login_id
            },
              'secret',
            {
              expiresIn: 180000 // second
            }
          );
          console.log(token);
          //console.log(config.url_server);
          //var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
          let mailOptions = {
              from: '"[瀬戸内空と海ネットショップ]パスワードリセット" <'+recordset[0].member_mail_address+'>', // sender address
              to: recordset[0].member_mail_address+','+recordset[0].member_mail_address  +'', // list of receivers
              subject: '[瀬戸内空と海ネットショップ]パスワードリセット' , // Subject line
              text: '', // plain text body
              html: '【'+recordset[0].member_name+'】様 <br><br>瀬戸内空と海のネットショップアカウント（【'+recordset[0].member_mail_address+'】）のパスワード再設定の依頼を受け付けました。<br>下のリンクをクリックしてパスワードの再設定を行ってください：<br><br>'+config_var.url_server+'/forgetpassword/'+token+''+
              '<br><br>┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌<br><br>瀬戸内空と海ネットショップ<br>〒714-0037　東京都千代田区神田紺屋町１１岩田ビル302<br>tel：086-250-0559　fax：086－250-0359'+
              '<br> E-Mail：info@setouchi-soratoumi.com<br>URL ：http://setouchi-soratoumi.com/<br><br>┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌'

          };

          // send mail with defined transport object

          transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                  return console.log(error);
              }
              var text = {forget_password_send_mail:"true"};
              //console.log(max_mamber_id);
              res.json(text);
              console.log('Message %s sent: %s', info.messageId, info.response);
          });

        //  console.log(recordset);
      //    res.json(recordset);
    }
    else{
          var text = {forget_password_send_mail:"false"};
          res.json(text);
    }
          conn.close();

            })
            .catch(function(err) {
                console.log(err);
                conn.close();
            });
    });
});
/*End forget_password*/


/*login_member*/
router.post('/api/login_member', function(req, res) {
    var conn = new sql.Connection(config);
    var member_mail_address = fjapan.japan(req.body.member_mail_address);
    var member_login_password = fjapan.japan(req.body.member_login_password);
    var str_sql;
    var member_id = 0 ;
    var member_name = null ;

    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('member_mail_address', sql.VarChar, member_mail_address);
        req.input('member_login_password', sql.VarChar, member_login_password);
        if(member_mail_address && member_login_password)
        {
              str_sql = "SELECT * FROM M_MEMBER WHERE member_mail_address =@member_mail_address AND  member_login_password = @member_login_password";
        }


        req.query(str_sql).then(function(recordset) {
            console.log(recordset);
            if(recordset.length > 0){
              member_id = recordset[0]['member_id'] ;
              member_name = recordset[0]['member_name'] ;
            }
            else{
                 member_id = null;
            }
              var text = {"member_id":member_id,"member_name":member_name};
              conn.close();
              res.json(text);


            })
            .catch(function(err) {
                console.log(err);
                conn.close();
            });
    });
});
/*End login_member*/

/*member_byusername*/
router.post('/api/member_byusername', function(req, res) {
    var conn = new sql.Connection(config);
    var member_login_id = fjapan.japan(req.body.member_login_id);
    var str_sql;
    var member_id = 0 ;
if(member_login_id){
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('member_login_id', sql.VarChar, member_login_id);
        if(member_login_id)
        {
              str_sql = "SELECT * FROM M_MEMBER WHERE member_login_id =@member_login_id and member_login_id <> '' ";
        }


        req.query(str_sql).then(function(recordset) {
            console.log(recordset);
            if(recordset.length > 0){
             var text = {"member_byusername":true};
            }
            else{
             var text = {"member_byusername":false};
            }
            //  var text = {"member_id":member_id,"member_name":recordset[0]['member_name']};
              conn.close();
              res.json(text);


            })
            .catch(function(err) {
                console.log(err);
                conn.close();
            });
    });
  }
  else{
   var text = {"member_byusername":false};
      res.json(text);
  }
});
/*End login_member*/

/*ADD*/
router.post('/api/member_add', function(req, res) {
    var max_mamber_id;
    var con = new sql.Connection(config);

    con.connect().then(function() {
        try {
            var req2 = new sql.Request(con);

            str_sql = "SELECT MAX(member_id) max_mamber_id FROM M_MEMBER  ";
            req2.query(str_sql).then(function(recordset) {
                if (recordset[0].max_mamber_id == null) {
                    max_mamber_id = 1;
                } else {
                    max_mamber_id = recordset[0].max_mamber_id + 1;
                }
                con.close();
            })
            var conn = new sql.Connection(config);
            var member_id = req.body.member_id;
            var str_sql;
            var member_name = fjapan.japan(req.body.member_name);
            var member_name_kana = fjapan.japan(req.body.member_name_kana);
            var member_login_id = fjapan.japan(req.body.member_login_id);
            var member_login_password = fjapan.japan(req.body.member_login_password);
            var member_address = fjapan.japan(req.body.member_address);
            var member_address_destination = fjapan.japan(req.body.member_address_destination);
            var member_tel1 = fjapan.japan(req.body.member_tel1);
            var member_tel2 = fjapan.japan(req.body.member_tel2);
            var member_gender = req.body.member_gender;
            var member_letter = req.body.member_letter;
            var member_mail_address = fjapan.japan(req.body.member_mail_address);
            var member_image_name = fjapan.japan(req.body.member_image_name);
            var province = req.body.province;
            var province_des = req.body.province_des;
            if (req.body.member_image) {
                var member_image = req.body.member_image.split(',');
            }




            var member_birthday = req.body.member_birthday;

              if (member_image && member_image_name) {
                var type_name = member_image_name.split('.');
                var fileName = Math.round(new Date()) + '.' + type_name[1];
                var member_Image = fileName;
                fs.writeFile(mediaPath + '/member_image/' + fileName, member_image[1], 'base64', function(err) {

                    if (!err) {
                        console.log('Success');

                    } else {
                        console.log(err);
                    }
                });

            }


            conn.connect().then(function() {
                var req = new sql.Request(conn);
                req.input('member_id', sql.Int, max_mamber_id);
                req.input('member_name', sql.VarChar, member_name);
                req.input('member_name_kana', sql.VarChar, member_name_kana);
                req.input('member_login_id', sql.VarChar, member_login_id);
                req.input('member_login_password', sql.VarChar, member_login_password);
                req.input('member_address', sql.VarChar, member_address);
                req.input('member_address_destination', sql.VarChar, member_address_destination);
                req.input('member_tel1', sql.VarChar, member_tel1);
                req.input('member_tel2', sql.VarChar, member_tel2);
                req.input('member_gender', sql.Int, member_gender);
                req.input('member_letter', sql.Int, member_letter);
                req.input('member_mail_address', sql.VarChar, member_mail_address);
                req.input('member_image', sql.VarChar, member_Image);
                req.input('member_birthday', sql.DateTime2, member_birthday);

                req.input('province', sql.Int, province);
                req.input('province_des', sql.Int, province_des);

                req.input('del_flag', sql.VarChar, 0);
                req.input('regis_date', sql.VarChar, 'GETDATE()');
                req.input('upd_date', sql.VarChar, 'GETDATE()');
                str_sql = "INSERT INTO M_MEMBER (" +
                    "member_id" +
                    ",member_name" +
                    ",member_name_kana" +
                    ",member_login_id" +
                    ",member_login_password" +
                    ",member_address" +
                    ",member_address_destination" +
                    ",member_tel1" +
                    ",member_tel2" +
                    ",member_gender" +
                    ",member_letter" +
                    ",member_mail_address" +
                    ",member_image" +
                    ",member_birthday" +
                    ",province" +
                    ",province_des" +
                    ",del_flag" +
                    ",regis_date" +
                    ",upd_date )" +
                    "VALUES " +
                    "(@member_id" +
                    ",@member_name" +
                    ",@member_name_kana" +
                    ",@member_login_id" +
                    ",@member_login_password" +
                    ",@member_address" +
                    ",@member_address_destination" +
                    ",@member_tel1" +
                    ",@member_tel2" +
                    ",@member_gender" +
                    ",@member_letter" +
                    ",@member_mail_address" +
                    ",@member_image" +
                    ",@member_birthday" +
                    ",@province" +
                    ",@province_des" +
                    ",@del_flag" +
                    ",GETDATE()" +
                    ",GETDATE())";

                req.query(str_sql).then(function(recordset) {
                        var text = {"memBer_Add":"true","member_id":max_mamber_id};
                        //console.log(max_mamber_id);
                        res.json(text);
                        conn.close();
                    })
                    .catch(function(err) {
                        console.log(err);
                        conn.close();
                    });
            });
        } catch (err) {
            console.log('Error: ', err.message);
        }
    });

});
/*End Add*/
/*Update*/

router.post('/api/member_update', function(req, res) {
    var conn = new sql.Connection(config);

    var member_id = req.body.member_id;
    var str_sql;
    var member_name = fjapan.japan(req.body.member_name);
    var member_name_kana = fjapan.japan(req.body.member_name_kana);
    var member_login_id = fjapan.japan(req.body.member_login_id);
    var member_login_password = fjapan.japan(req.body.member_login_password);
    var member_address = fjapan.japan(req.body.member_address);
    var member_address_destination = fjapan.japan(req.body.member_address_destination);
    var member_tel1 = fjapan.japan(req.body.member_tel1);
    var member_tel2 = fjapan.japan(req.body.member_tel2);
    var member_gender = req.body.member_gender;
    var member_letter =req.body.member_letter;
    var member_mail_address = fjapan.japan(req.body.member_mail_address);
    var member_birthday = req.body.member_birthday;
    var del_flag = req.body.del_flag;
    var member_image_name = fjapan.japan(req.body.member_image_name);

    var province = req.body.province;
    var province_des = req.body.province_des;

      console.log(member_image_name);
    if (req.body.member_image) {
        var member_image = req.body.member_image.split(',');
    }

    if (member_image && member_image_name) {
        var type_name = member_image_name.split('.');
        var fileName = Math.round(new Date()) + '.' + type_name[1];
        var member_Image = fileName;
        fs.writeFile(mediaPath + '/member_image/' + fileName, member_image[1], 'base64', function(err) {

            if (!err) {
                console.log('Success');

            } else {
                console.log(err);
            }
        });

    }

    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('member_id', sql.Int, member_id);
        req.input('member_name', sql.VarChar, member_name);
        req.input('member_name_kana', sql.VarChar, member_name_kana);
        req.input('member_login_id', sql.VarChar, member_login_id);
        req.input('member_login_password', sql.VarChar, member_login_password);
        req.input('member_address', sql.VarChar, member_address);
        req.input('member_address_destination', sql.VarChar, member_address_destination);
        req.input('member_tel1', sql.VarChar, member_tel1);
        req.input('member_tel2', sql.VarChar, member_tel2);
        req.input('member_gender', sql.Int, member_gender);
        req.input('member_letter', sql.Int, member_letter);
        req.input('member_mail_address', sql.VarChar, member_mail_address);
        req.input('member_image', sql.VarChar, member_Image);
        req.input('member_birthday', sql.DateTime2, member_birthday);

        req.input('province', sql.Int, province);
        req.input('province_des', sql.Int, province_des);

        req.input('del_flag', sql.Int, del_flag);
        req.input('regis_date', sql.VarChar, 'GETDATE()');
        req.input('upd_date', sql.VarChar, 'GETDATE()');
        str_sql = "UPDATE M_MEMBER SET " +
            "member_name=@member_name" +
            ",member_name_kana=@member_name_kana" +
            ",member_login_id=@member_login_id" +
            ",member_login_password=@member_login_password" +
            ",member_address=@member_address" +
            ",member_address_destination=@member_address_destination" +
            ",member_tel1=@member_tel1" +
            ",member_tel2=@member_tel2" +
            ",member_gender=@member_gender" +
            ",member_letter=@member_letter" +
            ",member_mail_address=@member_mail_address" ;
          // if(member_Image){
              str_sql += ",member_image=@member_image" ;
          // }
      str_sql +=  ",member_birthday=@member_birthday" +
          ",province=@province" +
          ",province_des=@province_des" +
            ",del_flag=@del_flag" +
            ",upd_date=GETDATE()" +
            "  WHERE member_id=@member_id";

        req.query(str_sql).then(function(recordset) {
                var text = {"memBer_Update":"true","member_id":member_id};
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
/*Delete*/

router.post('/api/member_delete', function(req, res) {
    var conn = new sql.Connection(config);
    var member_id = req.body.member_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('member_id', sql.Int, member_id);
        str_sql = "DELETE M_MEMBER WHERE member_id =@member_id ";

        req.query(str_sql).then(function(recordset) {
                var text = '{"member_Delete_id' + member_id + '":"true"}';
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

/*End Delete*/
/*API member End*/
module.exports = router;
