var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fs = require('fs');

var mediaPath = __dirname+'/';
var multer = require('multer');

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}





var DIR = mediaPath + '/product_image/';
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, DIR)
    },
    filename: function(req, file, cb) {
        // crypto.pseudoRandomBytes(16, function(err, raw) {
            // cb(null, raw.toString('hex') + Date.now() + '.' + file.originalname);
        // });
        var image_name = file.originalname;
        var type_name = image_name.split('.');
        var fileName = Math.round(new Date()) + '.' + type_name[1];
        var image_name = fileName;
        cb(null, image_name);

    }
});

var upload = multer({ storage: storage });

/*API product_image*/

/*Select TOP 1 */
router.post('/api/product_image_top1', function(req, res) {
    var conn = new sql.Connection(config);
    var product_id = req.body.product_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('product_id', sql.Int, product_id);
        if (product_id) {
            str_sql = "SELECT TOP 1  * FROM M_PRODUCT_IMAGE WHERE product_id =@product_id ";
        } else {
            str_sql = "SELECT TOP 1 * FROM M_PRODUCT_IMAGE  ";
        }
        req.query(str_sql).then(function(recordset) {


          for(let i = 0 ; i<recordset.length ; i++){
            if(recordset[i]['image_name']){
                //console.log(mediaPath + '/member_image/'+recordset[i]['member_image']);

                  //load(mediaPath + '/member_image/'+recordset[i]['member_image']);
                recordset[i]['image_name_BASE64'] =   base64_encode(mediaPath + '/product_image/'+recordset[i]['image_name']);
                  // Then you'll be able to handle the myimage.png file as base64

            }
          }

                // console.log(recordset);
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
router.post('/api/product_image', function(req, res) {
    var conn = new sql.Connection(config);
    var product_id = req.body.product_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('product_id', sql.Int, product_id);
        if (product_id) {
            str_sql = "SELECT * FROM M_PRODUCT_IMAGE WHERE product_id =@product_id ";
        } else {
            str_sql = "SELECT * FROM M_PRODUCT_IMAGE  ";
        }
        req.query(str_sql).then(function(recordset) {


          for(let i = 0 ; i<recordset.length ; i++){
            if(recordset[i]['image_name']){
                //console.log(mediaPath + '/member_image/'+recordset[i]['member_image']);

                  //load(mediaPath + '/member_image/'+recordset[i]['member_image']);
                recordset[i]['image_name_BASE64'] =   base64_encode(mediaPath + '/product_image/'+recordset[i]['image_name']);
                  // Then you'll be able to handle the myimage.png file as base64

            }
          }

                // console.log(recordset);
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
router.post('/api/product_image_add', upload.any(), function(req, res) {
    // console.log(req.body.product_id);
    // console.log(req.files[0].filename);
    var max_product_image_id;

    var con = new sql.Connection(config);
    con.connect().then(function() {
        try {
            var req2 = new sql.Request(con);

            str_sql = "SELECT MAX(image_id) max_product_image_id FROM M_PRODUCT_IMAGE  ";
            req2.query(str_sql).then(function(recordset) {
                if (recordset[0].max_product_image_id == null) {
                    max_product_image_id = 1;
                } else {
                    max_product_image_id = recordset[0].max_product_image_id + 1;
                }
                // console.log(max_product_image_id);
                //res.json(recordset);
                con.close();
                //console.log(max_mamber_id);
            })

            var conn = new sql.Connection(config);
            var product_id = req.body.product_id;
            console.log(req.body.product_id);
            // var product_id = 16;
            var str_sql;
            // var image_name = req.body.image_name;

            var image_name = req.files[0].filename;

            // var type_name = image_name.split('.');
            // var fileName = Math.round(new Date()) + '.' + type_name[1];
            // var image_name = fileName;

            // var product_image_name = req.body.product_image_name;
            // console.log(product_image_name);
            // if (req.body.image_name) {
            //     var image_name = req.body.image_name.split(',');
            // }
            //
            // if (image_name && product_image_name) {
            //     var type_name = product_image_name.split('.');
            //     var fileName = Math.round(new Date()) + '.' + type_name[1];
            //     var member_Image = fileName;
            //     fs.writeFile(mediaPath + '/member_image/' + fileName, member_image[1], 'base64', function(err) {
            //
            //         if (!err) {
            //             console.log('Success');
            //
            //         } else {
            //             console.log(err);
            //         }
            //     });
            //
            // }

            conn.connect().then(function() {
                var req = new sql.Request(conn);
                req.input('image_id', sql.Int, max_product_image_id);
                req.input('product_id', sql.Int, product_id);
                req.input('image_name', sql.VarChar, image_name);
                req.input('del_flag', sql.VarChar, 0);
                req.input('regis_date', sql.VarChar, 'GETDATE()');
                req.input('upd_date', sql.VarChar, 'GETDATE()');
                str_sql = "INSERT INTO M_PRODUCT_IMAGE (" +
                    "image_id" +
                    ",product_id" +
                    ",image_name" +
                    ",del_flag" +
                    ",regis_date" +
                    ",upd_date )" +
                    "VALUES " +
                    "(@image_id" +
                    ",@product_id" +
                    ",@image_name" +
                    ",@del_flag" +
                    ",GETDATE()" +
                    ",GETDATE())";

                req.query(str_sql).then(function(recordset) {
                        var text = {"product_image_Add":"true"};
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

/*Delete*/

router.post('/api/product_image_delete', function(req, res) {
    var conn = new sql.Connection(config);
    var image_id = req.body.image_id;
    var str_sql;
    conn.connect().then(function() {
        var req = new sql.Request(conn);
        req.input('image_id', sql.Int, image_id);
        str_sql = "DELETE M_PRODUCT_IMAGE WHERE image_id =@image_id ";

        req.query(str_sql).then(function(recordset) {
                var text = {"product_Image_Delete":"true","image_id":image_id};
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

/*End API product_image*/

module.exports = router;
