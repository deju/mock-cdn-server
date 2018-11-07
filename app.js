
const express = require('express');
const readConfig = require('read-config');
const path = require('path');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const serveIndex = require('serve-index');
const mkdir = require('./mkdir');
const codes = require('./codes');

let config = readConfig('./config');

const dirname = __dirname;
if (fs.existsSync(path.join(dirname, 'local.config.json'))) {
    config = readConfig('./local.config.json');
}

const staticPath = config.cdn_path || '';
const staticDir = path.join(dirname, config.file_dir);

const app = express();
if (!fs.existsSync(staticDir)) {
    mkdir(staticDir);
}

app.use(express.static(staticDir));
app.use('/files', serveIndex(staticDir, { 'icons': true }));

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
                const err = new Error(curFilePath.replace(staticDir, '') + ' exists already');
                err.code = codes.EXIST;
                throw err;
            }

            fs.writeFileSync(curFilePath, curFile.data, 'utf-8');

        });

        return res.json({
            code: codes.SUCCESS,
            message: 'success'
        });
    } catch (e) {
        if (e && e.code === codes.EXIST) {
            return res.status(405).json({
                code: codes.EXIST,
                message: e.message
            });
        }
        return res.status(409).json({
            code: codes.ERROR,
            message: e.message
        });
    }
});

app.get('/', function (req, res) {
    res.send('<br>simple-cdn-server doing, all files listing in <a href="/files/">here</a>');
})

app.listen(3030);
console.log('listen 3030');
