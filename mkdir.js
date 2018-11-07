
const path = require('path');
const fs = require('fs');

function mkdir(filepath) {
    var dirname = path.dirname(filepath);

    if (!fs.existsSync(dirname)) {
        mkdir(dirname);
    }

    fs.mkdirSync(filepath);
}


module.exports = mkdir;
