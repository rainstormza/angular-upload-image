var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fjapan = require('../fjapan');
/*API shipping*/
/*Select*/
router.post('/api/order', function(req, res) {
    var conn = new sql.Connection(config);
    var order_id = req.body.order_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('order_id', sql.Int, order_id);
        if (order_id) {
            str_sql = "SELECT * FROM M_ORDER WHERE order_id =@order_id AND  del_flag <> 9   or ISNULL(del_flag,0) = 0 ";
        } else {
            str_sql = "SELECT * FROM M_ORDER WHERE  del_flag <> 9  or ISNULL(del_flag,0) = 0   ";
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
router.post('/api/order_add', function(req, res) {
    var max_order_id;
    var max_order_detail_id;

    var con = new sql.Connection(config);
    con.connect().then(function() {
        // try {
        var req2 = new sql.Request(con);

        str_sql = "SELECT MAX(order_id) max_order_id FROM M_ORDER  ";
        req2.query(str_sql).then(function(recordset) {
            // console.log('555');
            if (recordset[0].max_order_id == null) {
                max_order_id = 1;
                // console.log(max_order_id);

            } else {
                max_order_id = recordset[0].max_order_id + 1;
                // console.log(max_order_id);

            }

            var req3 = new sql.Request(con);
            str_sql = "SELECT MAX(order_detail_id) max_order_detail_id FROM M_ORDER_DETAIL  ";
            req3.query(str_sql).then(function(recordset) {
                if (recordset[0].max_order_detail_id == null) {
                    max_order_detail_id = 1;
                    // console.log(max_order_detail_id);
                } else {
                    max_order_detail_id = recordset[0].max_order_detail_id + 1;
                    // console.log(max_order_detail_id);

                }
                con.close();
                //console.log(max_mamber_id);

                var conn = new sql.Connection(config);

                var str_sql;
                var member_id = req.body.member_id;
                var shipping_id = req.body.shipping_id;
                // var order_detail_id = req.body.order_detail_id;
                var order_detail_id = max_order_detail_id;
                // console.log('test');
                // console.log(order_detail_id);
                var purchase_date = req.body.purchase_date;
                var status_flg = req.body.status_flg;
                var summary_total = req.body.summary_total;
                var del_flag = req.body.del_flag;

                var comment = req.body.comment;
                // console.log(req.body.comment);
                var order_number = req.body.order_number;

                conn.connect().then(function() {
                    var req3 = new sql.Request(conn);
                    req3.input('order_number', sql.VarChar, order_number);
                    str_sql = "SELECT order_number  FROM M_ORDER WHERE order_number =  '"+order_number+"'";

                    req3.query(str_sql).then(function(recordset3) {
                            console.log(recordset3.length);
                            if(recordset3.length<=0){
                                var conn = new sql.Connection(config);
                              conn.connect().then(function() {
                                  var req = new sql.Request(conn);
                                  req.input('order_id', sql.Int, max_order_id);
                                  req.input('member_id', sql.Int, member_id);
                                  req.input('shipping_id', sql.Int, shipping_id);
                                  req.input('order_detail_id', sql.Int, order_detail_id);
                                  req.input('status_flg', sql.Int, status_flg);
                                  req.input('summary_total', sql.Int, summary_total);
                                  req.input('del_flag', sql.Int, del_flag);
                                  req.input('comment', sql.VarChar, comment);
                                  req.input('order_number', sql.VarChar, order_number);
                                  str_sql = "INSERT INTO M_ORDER (" +
                                      "order_id" +
                                      ",member_id" +
                                      ",shipping_id" +
                                      ",order_detail_id" +
                                      ",status_flg" +
                                      ",del_flag" +
                                      ",comment" +
                                      ",order_number" +
                                      ",summary_total" +
                                      ",purchase_date" +
                                      ",regis_date" +
                                      ",upd_date )" +
                                      "VALUES " +
                                      "(@order_id" +
                                      ",@member_id" +
                                      ",@shipping_id" +
                                      ",@order_detail_id" +
                                      ",@status_flg" +
                                      ",@del_flag" +
                                      ",@comment" +
                                      ",@order_number" +
                                      ",@summary_total" +
                                      ",GETDATE()" +
                                      ",GETDATE()" +
                                      ",GETDATE())";

                                  req.query(str_sql).then(function(recordset) {
                                          var text = {
                                              "order_Add": "true",
                                              "order_detail_id": max_order_detail_id
                                          };
                                          //console.log(max_mamber_id);
                                          res.json(text);
                                          //conn.close();
                                      })
                                      .catch(function(err) {
                                          console.log(err);
                                        //  conn.close();
                                      });
                              });

                            }
                            else{
                              var text = {
                                  "order_Add": false,
                              };
                              res.json(text);
                              onsole.log(text);
                            }
                            // var text = {
                            //     "order_number": recordset3,
                            // };
                            // console.log(recordset3);
                            // res.json(text);
                            // conn.close();
                        })
                        .catch(function(err) {
                            console.log(err);
                          //  conn.close();
                        });
                });




            })


            //console.log(max_mamber_id);
            //res.json(recordset);
            con.close();
            //console.log(max_mamber_id);
        })





        // } catch (err) {
        //     console.log('Error: ', err.message);
        // }
    });

});
/*End Add*/

/*Update*/

router.post('/api/order_update', function(req, res) {
    var conn = new sql.Connection(config);

    var str_sql;
    var order_id = req.body.order_id;
    var member_id = req.body.member_id;
    var shipping_id = req.body.shipping_id;
    var order_detail_id = req.body.order_detail_id;
    var purchase_date = req.body.purchase_date;
    var status_flg = req.body.status_flg;
    var summary_total = req.body.summary_total;
    var del_flag = req.body.del_flag;
    var comment = req.body.comment;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('order_id', sql.Int, order_id);
        req.input('member_id', sql.Int, member_id);
        req.input('shipping_id', sql.Int, shipping_id);
        req.input('order_detail_id', sql.Int, order_detail_id);
        req.input('status_flg', sql.Int, status_flg);
        req.input('summary_total', sql.Int, summary_total);
        req.input('del_flag', sql.Int, del_flag);
        req.input('comment', sql.Int, comment);
        str_sql = "UPDATE M_ORDER SET ";


        str_sql += "  status_flg=@status_flg";

        if (status_flg == 1) {
            str_sql += " ,  deliver_date=GETDATE()";
        }

        str_sql += ",upd_date=GETDATE(),comment=@comment" +

            "  WHERE order_id=@order_id";
        /*
               str_sql = "UPDATE M_ORDER SET "+
               "member_id=@member_id"+
               ",shipping_id=@shipping_id"+
               ",order_detail_id=@order_detail_id"+
               ",status_flg=@status_flg"+
               ",summary_total=@summary_total"+
               ",del_flag=@del_flag"+
               ",upd_date=GETDATE()"+
               "  WHERE order_id=@order_id" ;
*/
        console.log(str_sql);
        req.query(str_sql).then(function(recordset) {
                var text = {
                    "order_Update": "true"
                };
                console.log(status_flg);
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

router.post('/api/order_delete', function(req, res) {
    var conn = new sql.Connection(config);
    var order_id = req.body.order_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('order_id', sql.Int, order_id);
  str_sql = "UPDATE M_ORDER SET del_flag=9 ,  upd_date=GETDATE()  WHERE order_id =@order_id" ;
        req.query(str_sql).then(function(recordset) {
                var text = '{"order_Delete":"true"}';
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
