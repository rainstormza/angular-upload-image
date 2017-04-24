var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fjapan = require('../fjapan');
const nodemailer = require('nodemailer');



/*contact sendmail*/
router.post('/api/contact_send_mail', function(req, res){
  var contact_sender_mail = req.body.contact_sender_mail ;
  var content = req.body.content ;
  var contact_title = req.body.contact_title ;
  console.log(content);
  let transporter = nodemailer.createTransport({
    host: 'setouchi-sora.sakura.ne.jp',
    port: 587,
    auth: {
      user: 'info@setouchi-soratoumi.com',
      pass: 'user7777'
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
      from: '"Form KIBITO" <'+contact_sender_mail+'>', // sender address
      to: contact_sender_mail+','+contact_sender_mail  +'', // list of receivers
      subject: contact_title, // Subject line
      text: '', // plain text body
      html: '<b>'+contact_title+'</b><br>'+content // html body
  };

  // send mail with defined transport object

  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      var text = {contact_send_mail:"true"};
      //console.log(max_mamber_id);
      res.json(text);
       res.json(text);
      console.log('Message %s sent: %s', info.messageId, info.response);
  });
});
/*end contact sendmail*/
/*API shipping*/
/*Select*/
router.post('/api/contact', function(req, res){
  var conn = new sql.Connection(config);
  var contact_id  = req.body.contact_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('contact_id', sql.Int, contact_id);
    if(contact_id){
        str_sql = "SELECT *  ,case when read_flg=0 and  DATEADD(DAY, -3,GETDATE()) between  regis_date and GETDATE()    then '1' else '0' end  AS status_alert FROM M_CONTACT WHERE contact_id =@contact_id " ;
    }
    else{
         str_sql = "SELECT *  ,case when read_flg=0 and  DATEADD(DAY, -3,GETDATE()) between  regis_date and GETDATE()    then '1' else '0' end  AS status_alert FROM M_CONTACT  " ;
     }
    req.query(str_sql).then(function(recordset) {
      console.log(recordset);
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
/*ADD*/
router.post('/api/contact_add', function(req, res){
  var max_contact_id ;

    var con = new sql.Connection(config);
    con.connect().then(function () {
           try {
    var req2 = new sql.Request(con);

    str_sql = "SELECT MAX(contact_id) as max_contact_id FROM M_CONTACT  " ;
    req2.query(str_sql).then(function(recordset) {
        if(recordset[0].max_contact_id==null){
             max_contact_id = 1;
        }
        else{
              max_contact_id = recordset[0].max_contact_id+1;
        }
        //res.json(recordset);
        con.close();
//console.log(max_mamber_id);
         })

  var conn = new sql.Connection(config);

  var str_sql ;
  var contact_title  = fjapan.japan(req.body.contact_title) ;
  var contact_content =fjapan.japan( req.body.contact_content);
  var contact_sender = fjapan.japan(req.body.contact_sender);
  var contact_sender_mail = fjapan.japan(req.body.contact_sender_mail);
  var read_flg = req.body.read_flg;
  var del_flag = req.body.del_flag;


            conn.connect().then(function () {
            var req = new sql.Request(conn);
              req.input('contact_id', sql.Int, max_contact_id);
              req.input('contact_title', sql.VarChar, contact_title);
              req.input('contact_content', sql.VarChar, contact_content);
              req.input('contact_sender', sql.VarChar, contact_sender);
              req.input('contact_sender_mail', sql.VarChar, contact_sender_mail);
              req.input('read_flg', sql.VarChar, 0);

              req.input('del_flag', sql.VarChar, 0);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
              str_sql ="INSERT INTO M_CONTACT ("+
                                                  "contact_id"+
                                                  ",contact_title"+
                                                  ",contact_content"+
                                                  ",contact_sender"+
                                                  ",contact_sender_mail"+
                                                  ",read_flg"+
                                                  ",del_flag"+
                                                  ",regis_date"+
                                                  ",upd_date )"+
                                                  "VALUES "+
                                                  "(@contact_id"+
                                                  ",@contact_title"+
                                                  ",@contact_content"+
                                                  ",@contact_sender"+
                                                  ",@contact_sender_mail"+
                                                  ",@read_flg"+
                                                  ",@del_flag"+
                                                  ",GETDATE()"+
                                                  ",GETDATE())" ;

            req.query(str_sql).then(function(recordset) {
                var text = {"contact_Add":"true"};
                //console.log(max_mamber_id);
                res.json(text);
                conn.close();
                 })
                 .catch(function(err) {
                 console.log(err);
                 conn.close();
                 });
          });
}
 catch(err) {
        console.log('Error: ', err.message);
    }
  });

});
/*End Add*/

/*Update*/

router.post('/api/contact_update', function(req, res){
   var conn = new sql.Connection(config);

  var contact_id  = req.body.contact_id ;
  var str_sql ;
  var read_flg = req.body.read_flg;
  var del_flag = req.body.del_flag;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
              req.input('contact_id', sql.Int, contact_id);
              req.input('del_flag', sql.Int,del_flag);
              req.input('read_flg', sql.Int,read_flg);
               str_sql = "UPDATE M_CONTACT SET "+
               "read_flg=@read_flg"+
               ",del_flag=@del_flag"+
               ",upd_date=GETDATE()"+
               "  WHERE contact_id=@contact_id" ;

    req.query(str_sql).then(function(recordset) {
         var text = {"contact_Update":"true"};
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

router.post('/api/contact_delete', function(req, res){
  var conn = new sql.Connection(config);
  var contact_id  = req.body.contact_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('contact_id', sql.Int, contact_id);
        str_sql = "DELETE M_CONTACT WHERE contact_id =@contact_id " ;

    req.query(str_sql).then(function(recordset) {
       var text = {"contact_Delete":"true"};
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
/*End API shipping*/

module.exports = router;
