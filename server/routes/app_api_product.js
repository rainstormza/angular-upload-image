var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fjapan = require('../fjapan');

// var http = require('http').Server(express);
// var io = require('socket.io')(http);
const nodemailer = require('nodemailer');
//  console.log(config);


// io.on('connection', (socket) => {
//   console.log('user connected');
//
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
//
//   socket.on('add-message', (message) => {
//     io.emit('message', {type:'new-message', text: message});
//   });
// });
// http.listen(3002, () => {
// console.log('started on port 3002');
// });

/*API product*/

/*Select*/
router.post('/api/product', function(req, res){
  var conn = new sql.Connection(config);
  var product_id  = req.body.product_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('product_id', sql.Int, product_id);
    if(product_id){
        str_sql = "SELECT * FROM M_PRODUCT WHERE product_id =@product_id AND del_flag <> 9 " ;
    }
    else{
         str_sql = "SELECT * FROM M_PRODUCT  WHERE del_flag <> 9  " ;
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




router.post('/api/product_add_order_admin', function(req, res){
  var conn = new sql.Connection(config);
  var product_id  = req.body.product_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('product_id', sql.Int, product_id);
    if(product_id){
        str_sql = "SELECT * FROM M_PRODUCT WHERE product_id =@product_id AND product_stock > 0  AND del_flag <> 9  " ;
    }
    else{
         str_sql = "SELECT * FROM M_PRODUCT  WHERE product_stock > 0  AND del_flag <> 9 " ;
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
router.get('/api/product_getstock', function(req, res){




  var conn = new sql.Connection(config);
  var product_id  = req.body.product_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('product_id', sql.Int, product_id);

        str_sql = "SELECT product_stock FROM M_PRODUCT WHERE product_id =@product_id  AND del_flag <> 9 " ;

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

router.post('/api/product_byid', function(req, res){
  var conn = new sql.Connection(config);
  var product_id  = req.body.product_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('product_id', sql.VarChar, product_id);
    if(product_id){
        str_sql = "SELECT product_id , product_stock FROM M_PRODUCT WHERE product_id IN("+product_id+")   AND del_flag <> 9" ;
    }
    else{
         str_sql = "SELECT product_id , product_stock FROM M_PRODUCT   AND del_flag <> 9 " ;
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
router.post('/api/product_add', function(req, res){
    var max_product_id ;

    var con = new sql.Connection(config);
    con.connect().then(function () {
           try {
    var req2 = new sql.Request(con);

    str_sql = "SELECT MAX(product_id) max_product_id FROM M_PRODUCT  " ;
    req2.query(str_sql).then(function(recordset) {
        if(recordset[0].max_product_id==null){
             max_product_id = 1;
        }
        else{
              max_product_id = recordset[0].max_product_id+1;
        }
       //console.log(max_mamber_id);
        //res.json(recordset);
        con.close();
//console.log(max_mamber_id);
         })

  var conn = new sql.Connection(config);
  var product_id  = req.body.product_id ;

  var str_sql ;
  var category_id = req.body.category_id;
  var product_name =  fjapan.japan(req.body.product_name);

  var product_price = req.body.product_price;
  var product_stock = req.body.product_stock;
  var product_description = fjapan.japan(req.body.product_description);
  var product_nutrition = fjapan.japan(req.body.product_nutrition);
  var product_material = fjapan.japan(req.body.product_material);
  var product_capacity = fjapan.japan(req.body.product_capacity);
  var product_template = fjapan.japan(req.body.product_template);

  var preservation_method = fjapan.japan(req.body.preservation_method);
  var seller = fjapan.japan(req.body.seller);
  var manufacturer = fjapan.japan(req.body.manufacturer);
            conn.connect().then(function () {
            var req = new sql.Request(conn);
              req.input('max_product_id', sql.Int, max_product_id);
              req.input('category_id', sql.Int,  category_id);
              req.input('product_name', sql.VarChar, product_name);
              req.input('product_price', sql.Int, product_price);
              req.input('product_stock', sql.Int, product_stock);
              req.input('product_description', sql.VarChar, product_description);
              req.input('product_capacity', sql.VarChar, product_capacity);
              req.input('product_nutrition', sql.VarChar, product_nutrition);
              req.input('product_material', sql.VarChar, product_material);
              req.input('product_template', sql.VarChar, product_template);

                req.input('preservation_method', sql.VarChar, preservation_method);
                req.input('seller', sql.VarChar, seller);
                req.input('manufacturer', sql.VarChar, manufacturer);

              req.input('del_flag', sql.Int, 0);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
              str_sql ="INSERT INTO M_PRODUCT ("+
                                                  "product_id"+
                                                  ",category_id"+
                                                  ",product_name"+
                                                  ",product_price"+
                                                  ",product_stock"+
                                                  ",product_description"+
                                                  ",product_capacity"+
                                                  ",product_nutrition"+
                                                  ",product_material"+
                                                  ",product_template"+
                                                  ",preservation_method"+
                                                  ",seller"+
                                                  ",manufacturer"+
                                                  ",del_flag"+
                                                  ",regis_date"+
                                                  ",upd_date )"+
                                                  "VALUES "+
                                                  "(@max_product_id"+
                                                  ",@category_id"+
                                                  ",@product_name"+
                                                  ",@product_price"+
                                                  ",@product_stock"+
                                                  ",@product_description"+
                                                  ",@product_capacity"+
                                                  ",@product_nutrition"+
                                                  ",@product_material"+
                                                  ",@product_template"+
                                                  ",@preservation_method"+
                                                  ",@seller"+
                                                  ",@manufacturer"+
                                                  ",@del_flag"+
                                                  ",GETDATE()"+
                                                  ",GETDATE())" ;

            req.query(str_sql).then(function(recordset) {
                var text = {"product_Add":"true","product_id":max_product_id};
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

router.post('/api/product_update_stock', function(req, res){
   var conn = new sql.Connection(config);
  var str_sql ;
  var product_id  = req.body.product_id ;
  var product_stock = req.body.product_stock;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
    req.input('product_id', sql.Int, product_id);
    req.input('product_stock', sql.Int, product_stock);
    str_sql = "UPDATE M_PRODUCT SET "+
    "product_stock=@product_stock"+
    ",upd_date=GETDATE()"+
    "  WHERE product_id=@product_id" ;

    req.query(str_sql).then(function(recordset) {
         var text = {product_Update:"true"};
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



router.post('/api/product_update', function(req, res){
  var conn = new sql.Connection(config);
  var product_id  = req.body.product_id ;
  var str_sql ;
  var category_id = req.body.category_id;
  //var product_name = jconv.decode(  req.body.product_name, fromEncoding );
  var product_name =fjapan.japan(req.body.product_name);
  var product_price = req.body.product_price;
  var product_stock = req.body.product_stock;
  var product_stock_old = req.body.product_stock_old;
  var product_description = fjapan.japan(req.body.product_description);
  var product_nutrition = fjapan.japan(req.body.product_nutrition);
  var product_material = fjapan.japan(req.body.product_material);
  var product_capacity = req.body.product_capacity;
  var product_template = fjapan.japan(req.body.product_template);
  var preservation_method = fjapan.japan(req.body.preservation_method);
  var seller = fjapan.japan(req.body.seller);
  var manufacturer = fjapan.japan(req.body.manufacturer);

  var del_flag = req.body.del_flag;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
              req.input('product_id', sql.Int, product_id);
              req.input('category_id', sql.Int,  category_id);
              req.input('product_name', sql.VarChar, product_name);
              req.input('product_price', sql.Int, product_price);
              req.input('product_stock', sql.Int, product_stock);
              req.input('product_description', sql.VarChar, product_description);
              req.input('product_capacity', sql.VarChar, product_capacity);
              req.input('product_nutrition', sql.VarChar, product_nutrition);
              req.input('product_material', sql.VarChar, product_material);
              req.input('product_template', sql.VarChar, product_template);
              req.input('preservation_method', sql.VarChar, preservation_method);
              req.input('seller', sql.VarChar, seller);
              req.input('manufacturer', sql.VarChar, manufacturer);

              req.input('del_flag', sql.Int, del_flag);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
               str_sql = "UPDATE M_PRODUCT SET "+
               "category_id=@category_id"+
               ",product_name=@product_name"+
               ",product_price=@product_price"+
               ",product_stock=@product_stock"+
               ",product_description=@product_description"+
               ",product_capacity=@product_capacity"+
               ",product_nutrition=@product_nutrition"+
               ",product_material=@product_material"+
               ",product_template=@product_template"+
                ",preservation_method=@preservation_method"+
                 ",seller=@seller"+
                  ",manufacturer=@manufacturer"+
               ",del_flag=@del_flag"+
               ",upd_date=GETDATE()"+
               "  WHERE product_id=@product_id" ;

    req.query(str_sql).then(function(recordset) {
      var text = {"product_Update":"true","product_id":product_id};
      console.log(text);
      res.json(text);
      var sql_mail ;

      if(product_stock_old==0&&product_stock!=0){
        var transporter = nodemailer.createTransport({
                    host: 'setouchi-sora.sakura.ne.jp',
                    port: 587,
                    auth: {
                      user: 'info@setouchi-soratoumi.com',
                      pass: 'user7777'
                    }
                });

var conn2 = new sql.Connection(config);
         conn2.connect().then(function () {

            var req2 = new sql.Request(conn2);
            req2.input('product_id', sql.Int, product_id);
            sql_mail = "SELECT M.member_id ,S.member_name , S.member_mail_address FROM M_PRODUCT_SUBSCRIBE  as M LEFT JOIN M_MEMBER as S ON M.member_id = S.member_id WHERE M.product_id =@product_id AND ISNULL(S.member_mail_address,'')<> ''  ";

            req2.query(sql_mail).then(function(recordset_mail) {
                for(let i = 0 ; i  < recordset_mail.length ; i++){
                       console.log(recordset_mail[i]);

                       // setup email data with unicode symbols
                       let mailOptions = {
                           from: '[瀬戸内空と海ネットショップ]再入荷のお知らせ <'+recordset_mail[i].member_mail_address+'>', // sender address
                           to: recordset_mail[i].member_mail_address+','+recordset_mail[i].member_mail_address  +'', // list of receivers
                           subject: '[瀬戸内空と海ネットショップ]再入荷のお知らせ' , // Subject line
                           text: '', // plain text body
                           html: '【'+recordset_mail[i].member_name+'】様 <br><br>'+
                           'いつも当店をご利用いただきまして誠にありがとうございます。 <br>'+
                           '瀬戸内空と海ネットショップです。 <br><br>'+
                           'お問い合わせをいただいておりました商品【'+product_name+'】が<br>'+
                           '本日入荷をいたしましたのでご連絡をさせていただきました。 <br><br>'+
                           '在庫には限りがございますので、 <br>'+
                           'できるだけ早めにお買い上げいただけますよう <br>'+
                           'よろしくお願いいたします <br>'+
                           '┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌ <br><br>'+
                           '瀬戸内空と海ネットショップ <br>'+
                           '〒714-0037　東京都千代田区神田紺屋町１１岩田ビル302 <br>'+
                           'tel：086-250-0559　fax：086－250-0359 <br>'+
                           'E-Mail：info@setouchi-soratoumi.com<br>'+
                           'URL ：http://setouchi-soratoumi.com/ <br><br>'+
                           '┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌┌ <br>'




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
                //    console.log(recordset_mail);
                }

              })
              .catch(function(err) {
                console.log(err);
                conn.close();
              });
        });


      }



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

router.post('/api/product_delete', function(req, res){
  var conn = new sql.Connection(config);
  var product_id  = req.body.product_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('product_id', sql.Int, product_id);
      str_sql = "UPDATE M_PRODUCT SET del_flag=9 ,  upd_date=GETDATE()  WHERE product_id=@product_id" ;

    req.query(str_sql).then(function(recordset) {
       var text = '{"product_Delete":"true"}';
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

/*End API product*/

module.exports = router;
