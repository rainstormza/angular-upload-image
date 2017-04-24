var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fjapan = require('../fjapan');
/*API shipping*/
/*Select*/
router.post('/api/shipping', function(req, res){
  var conn = new sql.Connection(config);
  var shipping_id  = req.body.shipping_id ;
  console.log(shipping_id) ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('shipping_id', sql.Int, shipping_id);
    if(shipping_id||shipping_id==0){
        str_sql = "SELECT * FROM M_SHIPPING WHERE shipping_id =@shipping_id " ;

    }
    else{
         str_sql = "SELECT * FROM M_SHIPPING  " ;
     }
    req.query(str_sql).then(function(recordset) {
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

router.post('/api/shipping_f', function(req, res){
  var conn = new sql.Connection(config);
  var shipping_id  = req.body.shipping_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('shipping_id', sql.Int, shipping_id);
    if(shipping_id){
        str_sql = "SELECT * FROM M_SHIPPING WHERE shipping_id =@shipping_id  ISNULL(province_code,0) =  0  " ;

    }
    else{
         str_sql = "SELECT * FROM M_SHIPPING WHERE ISNULL(province_code,0) =  0   " ;
     }
    req.query(str_sql).then(function(recordset) {
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

router.post('/api/shipping_bydes', function(req, res){
  var conn = new sql.Connection(config);
  var province_des  = req.body.province_des ;
  var str_sql ;
    console.log(province_des);
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('province_des', sql.Int, province_des);
    if(province_des || province_des == 0){
        str_sql = "SELECT * FROM M_SHIPPING WHERE province_code =@province_des " ;
    }
    else if(province_des == null || province_des == '') {
         str_sql = "SELECT * FROM M_SHIPPING  " ;
     }
     console.log(str_sql);
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

/*Select province*/
router.post('/api/province', function(req, res){
  var conn = new sql.Connection(config);
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
         str_sql = "SELECT 都道府県コード as  province_code , 都道府県名 as province_name FROM M_都道府県 where 削除区分 = 0  " ;

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
router.post('/api/shipping_add_bydes', function(req, res){
  var max_shipping_id ;

    var con = new sql.Connection(config);
    con.connect().then(function () {
           try {
    var req2 = new sql.Request(con);

    str_sql = "SELECT MAX(shipping_id) max_shipping_id FROM M_SHIPPING  " ;
    req2.query(str_sql).then(function(recordset) {
        if(recordset[0].max_shipping_id==null){
             max_shipping_id = 1;
        }
        else{
              max_shipping_id = recordset[0].max_shipping_id+1;
        }
       //console.log(max_mamber_id);
        //res.json(recordset);
        con.close();
//console.log(max_mamber_id);
         })

  var conn = new sql.Connection(config);

  var str_sql ;
  var shipping_name  = fjapan.japan(req.body.shipping_name) ;
  var shipping_price = req.body.shipping_price;
  var shipping_free_flag = req.body.shipping_free_flag;
  var province_code = req.body.province_code;

            conn.connect().then(function () {
            var req = new sql.Request(conn);
              req.input('shipping_id', sql.Int, max_shipping_id);
              req.input('shipping_name', sql.VarChar, shipping_name);
              req.input('shipping_price', sql.Int,  shipping_price);
              req.input('shipping_free_flag', sql.Int, shipping_free_flag);
              req.input('province_code', sql.Int, province_code);
              req.input('del_flag', sql.VarChar, 0);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
              str_sql ="INSERT INTO M_SHIPPING ("+
                                                  "shipping_id"+
                                                  ",shipping_name"+
                                                  ",shipping_price"+
                                                  ",shipping_free_flag"+
                                                    ",province_code"+
                                                  ",del_flag"+
                                                  ",regis_date"+
                                                  ",upd_date )"+
                                                  "VALUES "+
                                                  "(@shipping_id"+
                                                  ",@shipping_name"+
                                                  ",@shipping_price"+
                                                  ",@shipping_free_flag"+
                                                  ",@province_code"+
                                                  ",@del_flag"+
                                                  ",GETDATE()"+
                                                  ",GETDATE())" ;

            req.query(str_sql).then(function(recordset) {
                var text = {shipping_Add:"true"};
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

router.post('/api/shipping_add', function(req, res){
  var max_shipping_id ;

    var con = new sql.Connection(config);
    con.connect().then(function () {
           try {
    var req2 = new sql.Request(con);

    str_sql = "SELECT MAX(shipping_id) max_shipping_id FROM M_SHIPPING  " ;
    req2.query(str_sql).then(function(recordset) {
        if(recordset[0].max_shipping_id==null){
             max_shipping_id = 1;
        }
        else{
              max_shipping_id = recordset[0].max_shipping_id+1;
        }
       //console.log(max_mamber_id);
        //res.json(recordset);
        con.close();
//console.log(max_mamber_id);
         })

  var conn = new sql.Connection(config);

  var str_sql ;
  var shipping_name  = fjapan.japan(req.body.shipping_name) ;
  var shipping_price = req.body.shipping_price;
  var shipping_free_flag = req.body.shipping_free_flag;
  var province_code = req.body.province_code;

            conn.connect().then(function () {
            var req = new sql.Request(conn);
              req.input('shipping_id', sql.Int, max_shipping_id);
              req.input('shipping_name', sql.VarChar, shipping_name);
              req.input('shipping_price', sql.Int,  shipping_price);
              req.input('shipping_free_flag', sql.Int, shipping_free_flag);
              req.input('province_code', sql.Int, province_code);
              req.input('del_flag', sql.VarChar, 0);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
              str_sql ="INSERT INTO M_SHIPPING ("+
                                                  "shipping_id"+
                                                  ",shipping_name"+
                                                  ",shipping_price"+
                                                  ",shipping_free_flag"+
                                                    ",province_code"+
                                                  ",del_flag"+
                                                  ",regis_date"+
                                                  ",upd_date )"+
                                                  "VALUES "+
                                                  "(@shipping_id"+
                                                  ",@shipping_name"+
                                                  ",@shipping_price"+
                                                  ",@shipping_free_flag"+
                                                  ",@province_code"+
                                                  ",@del_flag"+
                                                  ",GETDATE()"+
                                                  ",GETDATE())" ;

            req.query(str_sql).then(function(recordset) {
                var text = {shipping_Add:"true"};
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

router.post('/api/shipping_update', function(req, res){
   var conn = new sql.Connection(config);

  var shipping_id  = req.body.shipping_id ;
  var str_sql ;
  var shipping_name  = fjapan.japan(req.body.shipping_name) ;
  var shipping_price = req.body.shipping_price;
  var shipping_free_flag = req.body.shipping_free_flag;
  var province_code = req.body.province_code;
  var del_flag = req.body.del_flag;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
              req.input('shipping_id', sql.Int, shipping_id);
              req.input('shipping_name', sql.VarChar, shipping_name);
              req.input('shipping_price', sql.Int,  shipping_price);
              req.input('shipping_free_flag', sql.Int, shipping_free_flag);
              req.input('province_code', sql.Int, province_code);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
              req.input('del_flag', sql.Int,del_flag);
               str_sql = "UPDATE M_SHIPPING SET "+
               "shipping_name=@shipping_name"+
               ",shipping_price=@shipping_price"+
               ",shipping_free_flag=@shipping_free_flag"+
                ",province_code=@province_code"+
               ",del_flag=@del_flag"+
               ",upd_date=GETDATE()"+
               "  WHERE shipping_id=@shipping_id" ;

    req.query(str_sql).then(function(recordset) {
         var text = {"shipping_Update":"true"};
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

router.post('/api/shipping_delete', function(req, res){
  var conn = new sql.Connection(config);
  var shipping_id  = req.body.shipping_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('shipping_id', sql.Int, shipping_id);
        str_sql = "DELETE M_SHIPPING WHERE shipping_id =@shipping_id " ;

    req.query(str_sql).then(function(recordset) {
       var text = '{"shipping_Delete":"true"}';
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
