var mysql   = require('mysql');


/* DATABASE CONFIGURATION */
var connection = mysql.createConnection({
    host: 'cwolf.cs.sonoma.edu',
    user: 'mmckinney',
    password: '004137931'
    //user: 'your_username',
    //password: 'your_password'
});

var dbToUse = 'mmckinney';

//use the database for any queries run
var useDatabaseQry = 'USE ' + dbToUse;

//create the Account table if it does not exist
connection.query(useDatabaseQry, function (err) {
    if (err) throw err;

    var createTableQry = 'CREATE TABLE IF NOT EXISTS Account('
        + 'AccountID INT AUTO_INCREMENT PRIMARY KEY'
        + ',Username VARCHAR(50) UNIQUE'
        + ',Email VARCHAR(255) UNIQUE'
        + ',Password VARCHAR(50)'
        + ')';
    connection.query(createTableQry, function (err) {
        if (err) throw err;
    });
});

exports.GetAll = function(callback) {
    connection.query('select AccountID, Email from Account',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.update = function(Info, callback){
    console.log('UPDATE Account SET Username='+ '' + Info.Username +  ', fName=' +  Info.fName + ', lName=' + Info.lName + ', Bio=' +  Info.Bio + ' WHERE AccountID=' + Info.AccountID + ';');

    connection.query('UPDATE Account SET Username='+ '\'' + Info.Username +  '\', fName=\'' +  Info.fName + '\', lName=\'' + Info.lName + '\', Bio=\'' +  Info.Bio + '\' WHERE AccountID=' + Info.AccountID + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
        }
        callback(false, result);
    });
}

exports.GetDetails = function(Account, callback) {
    connection.query('select AccountID, Email, Username, Password, Bio, fName, lName from Account WHERE AccountID = '+ Account + ';',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.GetPosts = function(callback){
    connection.query('SELECT a.Username, p.Message FROM Account as a ' +
        '             JOIN Post as p' +
        '             ON a.AccountID = p.AccountID',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}

exports.createLab18View = function(AccountID, callback) {
    connection.query('CREATE OR REPLACE VIEW TwitterHome AS ' +
        'SELECT p.Message, a.Username, a.fName, a.lName, a.Bio, COUNT(p.Message) as postCount, COUNT(f.FollowerID) as followerCount, AVG(t.ReTweetCount) as retweetAverage, SUM(t.ReTweetCount) as retweetSum FROM Account as a ' +
        'JOIN Tweet as t' +
        ' ON a.AccountID = t.AccountID ' +
        'JOIN Followers as f ' +
        'ON a.AccountID = f.AccountID ' +
        'JOIN Post as p ' +
        'ON a.AccountID = p.AccountID '+
        'WHERE a.AccountID =' + AccountID + ' AND t.AccountID =' + AccountID + ' AND f.AccountID =' + AccountID + ' AND p.AccountID = ' + AccountID +
        ' GROUP BY a.AccountID;',
        function (err, result) {
            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);

        });
}

exports.getDetailsLab18 = function(callback){
    connection.query('SELECT * FROM TwitterHome;',
        function(err, result){
            if(err){
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        });
}


exports.createPostView = function(AccountID, callback){
    connection.query('CREATE OR REPLACE VIEW specificPosts AS Select a.Username, p.Message ' +
        '             FROM Account as a' +
        '             JOIN Post as p' +
        '             ON a.AccountID = p.AccountID' +
        '             WHERE a.AccountID = ' + AccountID + ' AND ' + 'p.AccountID = ' + AccountID + ';',
        function(err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        });

}

exports.createPostViewDetailed = function(AccountID, callback){
    connection.query('CREATE OR REPLACE VIEW specificPostsDetailed AS Select a.*, p.Message ' +
        '             FROM Account as a' +
        '             JOIN Post as p' +
        '             ON a.AccountID = p.AccountID' +
        '             WHERE a.AccountID = ' + AccountID + ' AND ' + 'p.AccountID = ' + AccountID + ';',
        function(err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        });

}

exports.GetSpecificPostDetailed = function(callback){
    connection.query('Select * FROM specificPostsDetailed;',
        function(err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        });
}


exports.GetSpecificPost = function(AccountID, callback){
    connection.query('Select * FROM specificPosts;',
        function(err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            console.log(result);
            callback(false, result);
        });
}

exports.Drop = function(callback){
    console.log('Hit Model Drop');
    connection.query('select Email, AccountID FROM Account',
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            callback(false, result);
        }
    );
}


exports.Insert = function(userInfo, callback) {
    console.log(userInfo);
    var query = 'INSERT INTO Account (Email, Username, Password) VALUES (\'' + userInfo.email + '\', \'' + userInfo.username + '\', \'' + userInfo.password  + '\');';
    console.log(query);
    connection.query(query,
        function (err, result) {
            if(err) {
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        }
    );
}

exports.InsertPost = function(userInfo, callback){
    console.log(userInfo);
    console.log('INSERT INTO Post (AccountID, Message) VALUES (' + userInfo.user + ', \'' + userInfo.posts + '\');');
    connection.query('INSERT INTO Post (AccountID, Message) VALUES (' + userInfo.user + ', \'' + userInfo.posts + '\');',
        function(err, result){
            if(err){
                console.log(err);
                callback(true);
                return
            }
            callback(false, result);
        });
}
