'use strict';

//Set up imports
let express = require('express');
let bodyParser = require('body-parser');
let nunjucks = require('nunjucks');
let routes = require('./routes');
let app = express();
//let morgan = require('morgan');
let volleyball = require('volleyball');
let models = require('./models');
let wikiRouter = require('./routes/wiki');
let usersRouter = require('./routes/users')
//Start server
//app.listen(3000);

//Utilize resources
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
//app.use(morgan);
app.use(volleyball);

//routes
//app.use('/', routes);
app.use('/wiki', wikiRouter);
app.use('/users', usersRouter);

//Nunjucks
let env = nunjucks.configure('view', { noCache: true });
app.set('view engine', 'html');
app.engine('html', nunjucks.render);


models.User.sync()
.then(function () {
    return models.Page.sync()
})
.then(function () {
    app.listen(3000);
    console.log('Server is listening on port 3000');
    // server.listen(3000, function () {
    //     console.log('Server is listening on port 3001!');
    // });
})
.catch(console.error);

