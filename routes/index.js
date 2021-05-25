var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 5,
  host:'localhost',
  user:'root',
  password: 'anffl!!8623',
  database:'on_the_board'
})

/* GET home page. */
router.get('/', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM product_tbl ORDER BY sales_amount DESC;', function(err, rows) {
      if(err) console.error("err: "+err);
      console.log("rows : "+JSON.stringify(rows));

      res.render('index', {title: 'test', rows : rows});
      connection.release();
    });
  })
});

/* 주문 화면 표시 */
router.get('/order', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    connection.query('select product_tbl.name as product_name, product_tbl.img_url, product_tbl.price, user_tbl.name, user_tbl.address, user_tbl.phone_number, user_tbl.email, product_tbl.id as product_id, user_tbl.id as user_id from product_tbl, user_tbl;', function(err, rows) {
      if(err) console.error("err: "+err);
      console.log("rows : "+JSON.stringify(rows));
      res.render('order', {title: '주문하기', rows : rows});
      connection.release();
    });
    
  });
});

/* 주문 로직*/
router.post('/order', function(req, res, next) {
  var user_id = req.body.user_id;
  var product_id = req.body.product_id;
  var product_cnt = req.body.product_cnt;
  var is_payed = 1;
  var total_money = req.body.total_money;
  var create_date =req.body.date;
  var datas =[user_id, product_id, product_cnt, is_payed, total_money, create_date];
  
  pool.getConnection(function(err, connection) {
    var sqlForInsertOrder = "insert into order_tbl(user_id, product_id, product_cnt, is_payed, total_money, create_date) values (?,?,?,?,?,?)"
    connection.query(sqlForInsertOrder, datas, function(err, rows) {
      if (err) console.error("err: " + err);
      console.log("rows : " + JSON.stringify(rows));

      res.redirect('/order-complete');
      connection.release();
    });
  });
});

router.get('/order-complete', function(req, res, next) {
  pool.getConnection(function(err, connection) {
    connection.query('select * from order_tbl;', function(err, rows) {
      if(err) console.error("err: "+err);
      console.log("rows : "+JSON.stringify(rows));
      res.render('order-complete', {title: '주문하기', rows : rows});
      connection.release();
    });
  });
});

module.exports = router;

