var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho'
};

var pool = new pg.Pool(config);

router.get('/', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }

      client.query('SELECT * FROM list',
            function (err, result) {
              if (err) {
                res.sendStatus(500);
                return;
              }

              res.send(result.rows);
            });
    } finally {
      done();
    }
  });
});

router.post('/', function (req, res) {
  pool.connect(function (err, client, done) {
    console.log('req: ', req.body);
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }
      //since the default is false when a new task is posted it will only need the task info
      client.query('INSERT INTO list (task) VALUES ($1) RETURNING *;',
        [req.body.task],
        function (err, result) {
          if (err) {
            console.log('Issue Querying the DB', err);
            res.sendStatus(500);
            return;
          }
          res.send(result.rows);
        })
    } finally {
      done();
    }
  });
});

router.put('/:id', function (req, res) {
  var id = req.params.id;
  var task = req.body.task;



  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to the DB', err);
        res.sendStatus(500);
        return;
      }
      client.query('UPDATE list SET task=$1, complete=$2, WHERE id=$3 RETURNING *;',
      [task, complete, id],
      function (err, result) {
        if (err) {
          console.log('Error querying database', err);
          res.sendStatus(500);

        } else {
          res.send(result.rows);
        }
      });
    } finally {
      done();
    }
  });

});

router.delete('/:id', function(req,res) {
  var id = req.params.id;
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error connecting to the DB', err);
        res.sendStatus(500);
        return;
      }
      client.query('DELETE FROM list WHERE id=$1;',
        [id],
        function (err, result) {
          if (err) {
            console.log('Error querying database', err);
            res.SendStatus(500);
            return;
          }
          res.send(204);
        });
    } finally {
      done();
    }
  });
});

module.exports = router;
