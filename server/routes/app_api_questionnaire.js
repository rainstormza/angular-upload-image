var express = require('express');
var router = express.Router();
var sql = require('mssql');
var config = require('../db_config');
var fjapan = require('../fjapan');
/*API questionnaire*/
/*Select*/
router.post('/api/questionnaire', function(req, res){
  var conn = new sql.Connection(config);
  var questionnaire_id  = req.body.questionnaire_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('questionnaire_id', sql.Int, questionnaire_id);
    if(questionnaire_id){
        str_sql = "SELECT * FROM M_QUESTIONNAIRE WHERE questionnaire_id =@questionnaire_id " ;
    }
    else{
         str_sql = "SELECT * FROM M_QUESTIONNAIRE  " ;
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
router.post('/api/questionnaire_add', function(req, res){
  var max_questionnaire_id ;

    var con = new sql.Connection(config);
    con.connect().then(function () {
           try {
    var req2 = new sql.Request(con);

    str_sql = "SELECT MAX(questionnaire_id) max_questionnaire_id FROM M_QUESTIONNAIRE  " ;
    req2.query(str_sql).then(function(recordset) {
        if(recordset[0].max_questionnaire_id==null){
             max_questionnaire_id = 1;
        }
        else{
              max_questionnaire_id = recordset[0].max_questionnaire_id+1;
        }
       //console.log(max_mamber_id);
        //res.json(recordset);
        con.close();
//console.log(max_mamber_id);
         })

  var conn = new sql.Connection(config);

  var str_sql ;
  var member_id  = req.body.member_id ;
  var questionnaire_hobby = fjapan.japan(req.body.questionnaire_hobby);
  var questionnaire_married = req.body.questionnaire_married;

            conn.connect().then(function () {
            var req = new sql.Request(conn);
              req.input('questionnaire_id', sql.Int, max_questionnaire_id);
              req.input('member_id', sql.Int, member_id);
              req.input('questionnaire_hobby', sql.VarChar,  questionnaire_hobby);
              req.input('questionnaire_married', sql.Int, questionnaire_married);
              req.input('del_flag', sql.VarChar, 0);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
              str_sql ="INSERT INTO M_QUESTIONNAIRE ("+
                                                  "questionnaire_id"+
                                                  ",member_id"+
                                                  ",questionnaire_hobby"+
                                                  ",questionnaire_married"+
                                                  ",del_flag"+
                                                  ",regis_date"+
                                                  ",upd_date )"+
                                                  "VALUES "+
                                                  "(@questionnaire_id"+
                                                  ",@member_id"+
                                                  ",@questionnaire_hobby"+
                                                  ",@questionnaire_married"+
                                                  ",@del_flag"+
                                                  ",GETDATE()"+
                                                  ",GETDATE())" ;

            req.query(str_sql).then(function(recordset) {
                var text = '{"questionnaire_Add":"true"}';
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

router.post('/api/questionnaire_update', function(req, res){
   var conn = new sql.Connection(config);

  var questionnaire_id  = req.body.questionnaire_id ;
  var str_sql ;
  var member_id  = req.body.member_id ;
  var questionnaire_hobby =  fjapan.japan(req.body.questionnaire_hobby);
  var questionnaire_married = req.body.questionnaire_married;
  var del_flag = req.body.del_flag;

  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
              req.input('questionnaire_id', sql.Int, questionnaire_id);
              req.input('member_id', sql.Int, member_id);
              req.input('questionnaire_hobby', sql.VarChar,questionnaire_hobby);
              req.input('questionnaire_married', sql.Int, questionnaire_married);
              req.input('del_flag', sql.Int, del_flag);
              req.input('regis_date', sql.VarChar, 'GETDATE()');
              req.input('upd_date', sql.VarChar, 'GETDATE()');
               str_sql = "UPDATE M_QUESTIONNAIRE SET "+
               "member_id=@member_id"+
               ",questionnaire_hobby=@questionnaire_hobby"+
               ",questionnaire_married=@questionnaire_married"+
               ",del_flag=@del_flag"+
               ",upd_date=GETDATE()"+
               "  WHERE questionnaire_id=@questionnaire_id" ;

    req.query(str_sql).then(function(recordset) {
         var text = '{"questionnaire_Update":"true"}';
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

router.post('/api/questionnaire_delete', function(req, res){
  var conn = new sql.Connection(config);
  var questionnaire_id  = req.body.questionnaire_id ;
  var str_sql ;
  conn.connect().then(function () {
    var req = new sql.Request(conn);
      req.input('questionnaire_id', sql.Int, questionnaire_id);
        str_sql = "DELETE M_QUESTIONNAIRE WHERE questionnaire_id =@questionnaire_id " ;

    req.query(str_sql).then(function(recordset) {
       var text = '{"questionnaire_Delete":"true"}';
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
/*End API questionnaire*/

module.exports = router;
