
const express = require('express');
const readConfig = require('read-config');
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const mkdir = require('./mkdir');
const codes = require('./codes');

const config = readConfig('./config');
const staticPath = config.cdn_path || '';
const staticDir = path.join(__dirname, config.file_dir);

const app = express();
if (!fs.existsSync(staticDir)) {
    mkdir(staticDir);
}

app.use(express.static(staticDir));

app.use(fileUpload());

app.post('/upload', function (req, res) {

    const filePath = (req.body && req.body.path) || '';
    const targetPath = path.join(staticDir, filePath.replace(/\.\.\//gi, ''));

    try {

        Object.keys(req.files).forEach(function (curFileName) {
            const curFile = req.files[curFileName];
            const curFilePath = path.join(targetPath, curFileName.replace(/\.\.\//gi, ''));
            if (!fs.existsSync(path.dirname(curFilePath))) {
                mkdir(path.dirname(curFilePath));
            }
            if (fs.existsSync(curFilePath)) {
                throw new Error(curFilePath.replace(staticDir, '') + ' exists already', codes.EXIST);
            }

            fs.writeFileSync(curFilePath, curFile.data, 'utf-8');

        });

        return res.json({
            code: codes.SUCCESS,
            message: 'success'
        });
    } catch (e) {
        return res.status(409).json({
            code: codes.ERROR,
            message: e.message
        });
    }
});

app.get('/', function (req, res) {
    res.send('simple-cdn-server doing');
})

app.listen(3030);
