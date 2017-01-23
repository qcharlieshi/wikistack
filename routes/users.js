let express = require('express');
let router = express.Router();
let models = require('../models');
let Page = models.Page;
let User = models.User;


router.get('/', function(req, res, next) {
  User.findAll({}).then(function(users){
    res.render('users', { users: users });
  }).catch(next);
});

router.get('/:userID', function(req, res, next) {
    let userPromise = User.findById(req.params.userID);
    let pagesPromise = Page.findAll({
        where: { authorId: req.params.userID } 
    });
    
    Promise.all([userPromise, pagesPromise]).then(function(values) {
        let user = values[0];
        let pages = values[1];
        res.render('userIndex', { user: user, pages: pages });
    }).catch(next);

})

module.exports = router;