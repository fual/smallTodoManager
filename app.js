var connectionSettings = require('./settings/connection');
var mysql = require('mysql');

var pool =  mysql.createPool(connectionSettings);

var tasks = require('./models/tasks')(pool);


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser());

var templates = require('consolidate');
app.engine('hbs', templates.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

var urlutils = require('url');

app.get('/', function(req, res) {
    var sort = req.param('sort') || 'def';
    tasks.list(sort , function(err, tasks) {
		//console.dir(tasks);

		res.render(
			'tasks.hbs', 
			{tasks: tasks},
			function(err, html) {
				if (err)
					throw err;

				res.render('layout.hbs', {
					content: html
				});
			}
		);
	});
});

app.post('/', function(req, res) {
	tasks.add(req.body.task, req.body.priority, function() {
		res.redirect('/');
	});
});

app.post('/delete', function(req, res) {
    tasks.delete(req.body.id, function() {
        res.redirect('/');
    });
});

app.post('/change', function(req, res) {
    tasks.change( req.body , function() {
        res.redirect('/');
    });
});


app.listen(8080);
console.log('Express server listening on port 8080');