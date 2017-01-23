'use strict';

//Set up imports
let express = require('express');
let bodyParser = require('body-parser');
let nunjucks = require('nunjucks');
let routes = require('./routes');
let app = express();
let morgan = require('morgan');

//Start server
app.listen(3000);

//Utilize resources
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', routes);
app.use(express.static('public'))
app.use(morgan);

//Nunjucks
let env = nunjucks.configure('view', { noCache: true });
app.set('view engine', 'html');
app.engine('html', nunjucks.render);

