var router = require('express').Router();
var pg = require('pg');

var config = {
  database: 'rho'
};

var pool = new pg.Pool(config);

//gets all the tasks in the database
router.get('/', function (req, res) {
  pool.connect(function (err, client, done) {
    try {
      if (err) {
        res.sendStatus(500);
        return;
      }
      //finds all the information from the list table
      client.query('SELECT * FROM list',
            function (err, result) {
              if (err) {
                res.sendStatus(500);
                return;
              }
              //and sends it back to the client.js
              res.send(result.rows);
            });
    } finally {
      done();
    }
  });
});

//adds new tasks to the database
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
          //sends the tasks back to client.js so they can be appended
          res.send(result.rows);
        })
    } finally {
      done();
    }
  });
});

//changes the selected (based on id) boolean value of completed tasks to true in the database
router.put('/:id', function (req, res) {
  var id = req.params.id;
  var task = req.body.task;
  var complete = req.body.complete;

  pool.connect(function (err, client, done) {
    try {
      if (err) {
        console.log('Error querying to the DB', err);
        res.sendStatus(500);
        return;
      }
      client.query('UPDATE list SET task=$1, complete=$2 WHERE id=$3 RETURNING *;',
      [task, complete, id],
      function (err, result) {
        if (err) {
          console.log('Error querying database', err);
          res.sendStatus(500);

        } else {
          console.log("result.rows", result.rows);
          //sens the updated information back to client.js so it can be appended 
          res.send(result.rows);
        }
      });
    } finally {
      done();
    }
  });

});

//deletes the selects row from the database
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
