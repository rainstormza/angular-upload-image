var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fjapan = require('../fjapan');
/*API shipping*/
/*Select*/
router.post('/api/subscribe', function(req, res){
  var conn = new sql.Connection(config);
  var member_id  = req.body.member_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('member_id', sql.Int, member_id);
    if(member_id){
        str_sql = "SELECT * FROM M_PRODUCT_SUBSCRIBE WHERE member_id =@member_id " ;
    }
    else{
         str_sql = "SELECT * FROM M_PRODUCT_SUBSCRIBE  " ;
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

/*Select*/
router.post('/api/subscribe_byid', function(req, res){

  var conn = new sql.Connection(config);
  var member_id  = req.body.member_id ;
  var product_id  = req.body.product_id ;
  console.log(product_id);
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('member_id', sql.Int, member_id);
      req.input('product_id', sql.Int, product_id);
    if(member_id&&product_id){
        str_sql = "SELECT * FROM M_PRODUCT_SUBSCRIBE WHERE member_id =@member_id and product_id = @product_id " ;
    }
    else{
         str_sql = "SELECT * FROM M_PRODUCT_SUBSCRIBE  " ;
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
router.post('/api/subscribe_add', function(req, res){
  var max_subscribe_id ;

    var con = new sql.Connection(config);
    con.connect().then(function () {
           try {
    var req2 = new sql.Request(con);

    str_sql = "SELECT MAX(subscribe_id) max_subscribe_id FROM M_PRODUCT_SUBSCRIBE  " ;
    req2.query(str_sql).then(function(recordset) {
        if(recordset[0].max_subscribe_id==null){
             max_subscribe_id = 1;
        }
        else{
              max_subscribe_id = recordset[0].max_subscribe_id+1;
        }



       //console.log(max_mamber_id);
        //res.json(recordset);
        con.close();
//console.log(max_mamber_id);
         })

  var conn = new sql.Connection(config);

  var str_sql ;
  var member_id = req.body.member_id;
  var product_id = req.body.product_id;
  var category_id = req.body.category_id;


            conn.connect().then(function () {
            var req = new sql.Request(conn);
              req.input('subscribe_id', sql.Int, max_subscribe_id);
              req.input('member_id', sql.Int, member_id);
              req.input('product_id', sql.Int,  product_id);
              req.input('category_id', sql.Int, category_id);
              str_sql ="INSERT INTO M_PRODUCT_SUBSCRIBE ("+
                                                  "subscribe_id"+
                                                  ",member_id"+
                                                  ",product_id"+
                                                  ",category_id"+
                                                  ",del_flag"+
                                                  ",regis_date"+
                                                  ",upd_date )"+
                                                  "VALUES "+
                                                  "(@subscribe_id"+
                                                  ",@member_id"+
                                                  ",@product_id"+
                                                  ",@category_id"+
                                                  ",0"+
                                                  ",GETDATE()"+
                                                  ",GETDATE())" ;

            req.query(str_sql).then(function(recordset) {
                var text = {"subscribe_Add":"true","subscribe_id":max_subscribe_id};
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


/*Delete*/

router.post('/api/subscribe_delete', function(req, res){
  var conn = new sql.Connection(config);
  var member_id  = req.body.member_id ;
  var product_id  = req.body.product_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('member_id', sql.Int, member_id);
      req.input('product_id', sql.Int, product_id);
        str_sql = "DELETE M_PRODUCT_SUBSCRIBE WHERE member_id =@member_id and  product_id =@product_id " ;

    req.query(str_sql).then(function(recordset) {
       var text ={"subscribe_Delete":"true"};
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
