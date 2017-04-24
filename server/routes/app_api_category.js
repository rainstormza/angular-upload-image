var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var mediaPath = __dirname+'/';
var fs = require('fs');
var fjapan = require('../fjapan');

function base64_encode(file) {
    // read binary data
    var bitmap = fs.readFileSync(file);
    // convert binary data to base64 encoded string
    return new Buffer(bitmap).toString('base64');
}


/*API category*/
/*Select*/
router.post('/api/category', function(req, res){
  var conn = new sql.Connection(config);
  var category_id  = req.body.category_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('category_id', sql.Int, category_id);
    if(category_id){
        str_sql = "SELECT * FROM M_CATEGORY WHERE category_id =@category_id " ;
    }
    else{
         str_sql = "SELECT * FROM M_CATEGORY  " ;
     }
    req.query(str_sql).then(function(recordset) {


      for(let i = 0 ; i<recordset.length ; i++){
        if(recordset[i]['category_image']){
            //console.log(mediaPath + '/member_image/'+recordset[i]['member_image']);

              //load(mediaPath + '/member_image/'+recordset[i]['member_image']);
            recordset[i]['category_image_BASE64'] =   base64_encode(mediaPath + '/category_image/'+recordset[i]['category_image']);
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


/*Select category_product*/
router.post('/api/category_product', function(req, res){
  var conn = new sql.Connection(config);
  var category_id  = req.body.category_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('category_id', sql.Int, category_id);

         str_sql = "SELECT distinct  m.*  FROM M_CATEGORY m LEFT JOIN M_PRODUCT p on  m.category_id = p.category_id where p.category_id <> ''  " ;

    req.query(str_sql).then(function(recordset) {


      for(let i = 0 ; i<recordset.length ; i++){
        if(recordset[i]['category_image']){
            //console.log(mediaPath + '/member_image/'+recordset[i]['member_image']);

              //load(mediaPath + '/member_image/'+recordset[i]['member_image']);
            recordset[i]['category_image_BASE64'] =   base64_encode(mediaPath + '/category_image/'+recordset[i]['category_image']);
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
router.post('/api/category_add', function(req, res){
  var max_category_id ;

    var con = new sql.Connection(config);
    con.connect().then(function () {
           try {
    var req2 = new sql.Request(con);

    str_sql = "SELECT MAX(category_id) max_category_id FROM M_CATEGORY  " ;
    req2.query(str_sql).then(function(recordset) {
        if(recordset[0].max_category_id==null){
             max_category_id = 1;
        }
        else{
              max_category_id = recordset[0].max_category_id+1;
        }
       //console.log(max_mamber_id);
        //res.json(recordset);
        con.close();
//console.log(max_mamber_id);
         })

  var conn = new sql.Connection(config);
  var category_id  = req.body.category_id ;
  var str_sql ;
  var category_name = fjapan.japan(req.body.category_name);
  // var category_image = req.body.category_image;
  var category_image_name = fjapan.japan(req.body.category_image_name);
  if (req.body.category_image) {
      var category_image = req.body.category_image.split(',');
  }

  if (category_image && category_image_name) {
      var type_name = category_image_name.split('.');
      var fileName = Math.round(new Date()) + '.' + type_name[1];
      var category_Image = fileName;
      fs.writeFile(mediaPath + '/category_image/' + fileName, category_image[1], 'base64', function(err) {

          if (!err) {
              console.log('Success');

          } else {
              console.log(err);
          }
      });

  }

            conn.connect().then(function () {
            var req = new sql.Request(conn);
              req.input('category_id', sql.Int, max_category_id);
              req.input('category_name', sql.VarChar,  category_name);
              req.input('category_image', sql.VarChar, category_Image);
              req.input('del_flag', sql.VarChar, 0);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
              str_sql ="INSERT INTO M_CATEGORY ("+
                                                  "category_id"+
                                                  ",category_name"+
                                                  ",category_image"+
                                                  ",del_flag"+
                                                  ",regis_date"+
                                                  ",upd_date )"+
                                                  "VALUES "+
                                                  "(@category_id"+
                                                  ",@category_name"+
                                                  ",@category_image"+
                                                  ",@del_flag"+
                                                  ",GETDATE()"+
                                                  ",GETDATE())" ;

            req.query(str_sql).then(function(recordset) {
                var text = '{"category_Add":"true"}';
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

router.post('/api/category_update', function(req, res){
   var conn = new sql.Connection(config);

  var category_id  = req.body.category_id ;
  var str_sql ;
  var category_name = fjapan.japan(req.body.category_name);
  // var category_image = req.body.category_image;
  var category_image_name = fjapan.japan(req.body.category_image_name);
  console.log(category_image_name);
  if (req.body.category_image) {
      var category_image = req.body.category_image.split(',');
  }

  if (category_image && category_image_name ) {
      var type_name = category_image_name.split('.');
      var fileName = Math.round(new Date()) + '.' + type_name[1];
      var category_Image = fileName;
      fs.writeFile(mediaPath + '/category_image/' + fileName, category_image[1], 'base64', function(err) {

          if (!err) {
              console.log('Success');

          } else {
              console.log(err);
          }
      });

  }

  var del_flag = req.body.del_flag;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
              req.input('category_id', sql.Int, category_id);
              req.input('category_name', sql.VarChar,  category_name);
              req.input('category_image', sql.VarChar, category_Image);
              req.input('del_flag', sql.Int, del_flag);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
               str_sql = "UPDATE M_CATEGORY SET "+
               "category_name=@category_name";
              //  if(category_Image) {
                 str_sql += ",category_image=@category_image"
              //  }
               str_sql += ",del_flag=@del_flag"+
               ",upd_date=GETDATE()"+
               "  WHERE category_id=@category_id" ;

    req.query(str_sql).then(function(recordset) {
         var text = '{"category_Update":"true"}';
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

router.post('/api/category_delete', function(req, res){
  var conn = new sql.Connection(config);
  var category_id  = req.body.category_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('category_id', sql.Int, category_id);
        str_sql = "DELETE M_CATEGORY WHERE category_id =@category_id " ;

    req.query(str_sql).then(function(recordset) {
       var text = '{"category_Delete":"true"}';
      console.log(category_id);
     res.json(category_id);
      conn.close();
    })
    .catch(function(err) {
      console.log(err);
      conn.close();
    });
  });
});

/*End Delete*/

/*End API category*/

module.exports = router;
