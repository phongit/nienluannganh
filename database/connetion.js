var mysql = require ('mysql');

var conn = mysql.createConnection({
    database: 'nienluan',
    host: "localhost",
    user: "root",
    password: "",
    multipleStatements: true
});

module.exports = conn;