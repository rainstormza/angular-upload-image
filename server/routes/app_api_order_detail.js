var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fjapan = require('../fjapan');
/*API shipping*/
/*Select*/
router.post('/api/order_detail', function(req, res) {
    var conn = new sql.Connection(config);
    var order_detail_id = req.body.order_detail_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('order_detail_id', sql.Int, order_detail_id);
        if (order_detail_id) {
            str_sql = "SELECT * FROM M_ORDER_DETAIL WHERE order_detail_id =@order_detail_id ";
        } else {
            str_sql = "SELECT * FROM M_ORDER_DETAIL  ";
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


router.post('/api/order_detail_byid', function(req, res) {
    var conn = new sql.Connection(config);
    var order_detail_id = req.body.order_detail_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('order_detail_id', sql.Int, order_detail_id);
        if (order_detail_id) {
            str_sql = "SELECT * FROM M_ORDER_DETAIL WHERE order_detail_id =@order_detail_id ";
        } else {
            str_sql = "SELECT * FROM M_ORDER_DETAIL  ";
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
router.post('/api/order_detail_add', function(req, res) {
    var max_order_detail_id;

    var con = new sql.Connection(config);
    con.connect().then(function() {
        //  try {
        var req2 = new sql.Request(con);

        str_sql = "SELECT MAX(order_detail_id) max_order_detail_id FROM M_ORDER_DETAIL  ";
        req2.query(str_sql).then(function(recordset) {
            if (recordset[0].max_order_detail_id == null) {
                max_order_detail_id = 1;
            } else {
                max_order_detail_id = recordset[0].max_order_detail_id + 1;
            }
            //console.log(max_mamber_id);
            //res.json(recordset);
            con.close();
            //console.log(max_mamber_id);
            var conn = new sql.Connection(config);

            var str_sql;
            var product_id = req.body.product_id;
            var quantity = req.body.quantity;
            var del_flag = req.body.del_flag;
            var order_detail_id = req.body.order_detail_id;


            // console.log(max_order_detail_id);
            conn.connect().then(function() {
                var req = new sql.Request(conn);
                req.input('order_detail_id', sql.Int, order_detail_id);
                req.input('product_id', sql.Int, product_id);
                req.input('quantity', sql.Int, quantity);
                req.input('del_flag', sql.Int, del_flag);
                str_sql = "INSERT INTO M_ORDER_DETAIL (" +
                    "order_detail_id" +
                    ",product_id" +
                    ",quantity" +
                    ",del_flag" +
                    ",regis_date" +
                    ",upd_date )" +
                    "VALUES " +
                    "(@order_detail_id" +
                    ",@product_id" +
                    ",@quantity" +
                    ",0" +
                    ",GETDATE()" +
                    ",GETDATE())";

                req.query(str_sql).then(function(recordset) {
                        var text = {
                            "order_Detail_Add": "true"
                        };
                        //console.log(max_mamber_id);
                        res.json(text);
                        conn.close();
                    })
                    .catch(function(err) {
                        console.log(err);
                        conn.close();
                    });
            });
            // }
            //  catch(err) {
            //         console.log('Error: ', err.message);
            //     }
        });
    })



});
/*End Add*/

/*Update*/

router.post('/api/order_detail_update', function(req, res) {
    var conn = new sql.Connection(config);

    var str_sql;
    var product_id = req.body.product_id;
    var quantity = req.body.quantity;
    var del_flag = req.body.del_flag;
    var order_detail_id = req.body.order_detail_id;

    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('order_detail_id', sql.Int, order_detail_id);
        req.input('product_id', sql.Int, product_id);
        req.input('quantity', sql.Int, quantity);
        req.input('del_flag', sql.Int, del_flag);
        str_sql = "UPDATE M_ORDER_DETAIL SET " +
            " quantity=@quantity" +
            ",del_flag=@del_flag" +
            ",upd_date=GETDATE()" +
            "  WHERE order_detail_id=@order_detail_id AND  product_id =@product_id ";

        req.query(str_sql).then(function(recordset) {
                var text = {
                    "order_Detail_Update": "true"
                };
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

router.post('/api/order_detail_detele', function(req, res) {
    var conn = new sql.Connection(config);
    var order_detail_id = req.body.order_detail_id;
    var product_id = req.body.product_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('order_detail_id', sql.Int, order_detail_id);
        req.input('product_id', sql.Int, product_id);
        str_sql = "DELETE M_ORDER_DETAIL WHERE order_detail_id =@order_detail_id AND product_id =@product_id ";

        req.query(str_sql).then(function(recordset) {
                var text = {
                    "order_Detail_Delete": "true"
                };
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
