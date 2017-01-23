let express = require('express');
let router = express.Router();


router.get('/', function (req, res) {
    //console.log('test');

   res.render( 'index', { showForm: true } );     
});




module.exports = router;