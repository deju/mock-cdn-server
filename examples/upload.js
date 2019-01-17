const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
const glob = require('glob')
const path = require('path')

const uploadUrl =  'http://172.28.49.71:3030';
const request = axios.create({
    baseURL: uploadUrl
});

const appPath = path.join(__dirname, '../');

const servePath = '/static/'; // '/spa-ria-portal-home/';
const fileDir = 'dist'; // '../ria-portal-home/build';


const allFiles = glob.sync('**/!(*.map)', { cwd: path.join(appPath, fileDir) });

const uploadPromises = allFiles.filter(function (file) {
    if (fs.statSync(path.join(appPath, fileDir, file)).isDirectory()) {
        return false;
    }

    return true;
}).map(createFormUpload);

console.log(allFiles);

function createFormUpload (file) {
    return new Promise(function(resolve, reject) {
        const form = new FormData();
        const absoluteFile = path.join(appPath, fileDir, file);
        form.append(file, fs.createReadStream(absoluteFile));
        const fileNameIndex = file.lastIndexOf('/');
        let curPath = fileNameIndex > -1 ? file.substring(fileNameIndex + 1) : '';
        const serveFilePath = path.join('/', servePath, curPath);
        form.append('path', servePath);

        request.post('/upload', form, {
            headers: form.getHeaders()
        })
        .then((res) => {
            resolve({
                status: 'done',
                file: absoluteFile,
                path: path.join(uploadUrl, servePath, file)
            })
        })
        .catch((error) => {
            // console.log(error.response ? error.response.data : error.message);
            if (error.response && error.response.data && error.response.data.code) {
                resolve({
                    status: 'error',
                    file: absoluteFile,
                    path: path.join(uploadUrl, servePath, file)
                })
            } else {
                reject(error);
            }
        });
    })
}


Promise.all(uploadPromises).then(function(rets) {
    console.log(rets)
})
