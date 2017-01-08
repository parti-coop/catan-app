var fs = require('fs-extra')

var dependencies = [
    ['node_modules/font-awesome/css/font-awesome.css','www/assets/venders/stylesheets/font-awesome.css'],
    ['node_modules/font-awesome/fonts','www/assets/venders/fonts']
];

dependencies.forEach(function(value) {
    fs.copy(value[0],value[1]);
});
