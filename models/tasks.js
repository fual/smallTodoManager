module.exports = function(pool){


    return Tasks = {
        list: function(sort, callback) {
            pool.getConnection(function(err, connection) {
                // Use the connection
                var order = '';
                if(sort === 'priority'){
                    order = ' ORDER BY priority DESC';
                }
                console.log(sort);
                connection.query( "SELECT * FROM tasks" + order, function(err, rows) {
                    callback(err, rows);
                    connection.release();
                });
            });
        },

        add: function(task,priority, callback) {
            pool.getConnection(function(err, connection) {
                // Use the connection
                connection.query( { sql : 'INSERT INTO tasks SET ?'} , {task: task, priority : priority}, function(err, rows) {
                    console.log(err);
                    callback(err, rows);
                    connection.release();
                });
            });
        },

        change: function(data, callback) {
            console.log(data)
            pool.getConnection(function(err, connection) {
                connection.config.queryFormat = function (query, values) {
                    if (!values) return query;
                    return query.replace(/\:(\w+)/g, function (txt, key) {
                        if (values.hasOwnProperty(key)) {
                            return this.escape(values[key]);
                        }
                        return txt;
                    }.bind(this));
                };
                // Use the connection
                connection.query( "UPDATE  tasks SET  task =  :task , priority = :priority WHERE  id = :id" , {task : data.task, priority : data.priority , id : data.id }, function(err, rows) {
                    console.log(err);
                    callback(err, rows);
                    connection.release();
                });
            });
        },
        /** Не писал это функцию потому, что не понял
        complete: function(id, callback) {

        },
        **/
        delete: function(id, callback) {
            pool.getConnection(function(err, connection) {
                // Use the connection
                connection.query("DELETE FROM tasks WHERE ?" , { id : id}, function(err, rows) {
                    console.log(err);
                    callback(err, rows);
                    connection.release();
                });
            });
        }
    };

};