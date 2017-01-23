let express = require('express');
let router = express.Router();
let models = require('../models');
let Page = models.Page;
let User = models.User;

router.get('/', function (req, res) {
    let page = Page.findAll();
    
    page.then( function(allPages) {
        console.log("Page info: " + allPages);
        res.render('index', { pageInfo: allPages, showForm: true })   
    });   
});



router.post('/', function(req, res, next) {
    User.findOrCreate({
        where: {
            name: req.body.author,
            email: req.body.authorEmail
        }
    }).then(function(values) {
        let user = values[0];

        console.log(req.body.tags);
        let formattedTags = req.body.tags.split(',');
        
        var page = Page.build({
            title: req.body.title,
            content: req.body.pageContent,
            tags: formattedTags
        });

        return page.save().then( function(savedPage) {
            return page.setAuthor(user);
        });
    }).then(function(page) {
        res.redirect((page.urlTitle));
    }).catch(next)
})

router.get('/add', function(req, res, next) {
  res.render('addpage');
});

router.get('/searchform', function(req, res, next) {
    res.render('search')
})

router.get('/search', function(req, res, next) {
    let tags = req.query.tags;
    //console.log(tags);

    Page.findByTag(tags).then( function(page) {
        //console.log(page);
        res.render('index', {pageInfo: page})
    });
})


router.get('/:urlTitle', function(req, res, next) {
    //console.log('/wiki/' + req.params.urlTitle);
    Page.findOne({ 
    where: { urlTitle: '/wiki/' + req.params.urlTitle },
    include: [{model: User, as: 'author' }]
    }).then(function(foundPage){
        //console.log(foundPage.toJSON());
        if (foundPage) {
            //res.send('Route is: ' + req.params.urlTitle);
            res.render( 'wikipage', { pageInfo: foundPage, showForm: true } );
        } else {
            res.status(404).send('Fuck off');
        }
    })
    .catch(next);
})




module.exports = router;