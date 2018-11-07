

const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')

const uploadUrl =  'http://127.0.0.1:3030'
const request = axios.create({
    baseURL: uploadUrl
})

const form = new FormData();

form.append('file.txt', fs.createReadStream(__dirname + '/file.txt'));
form.append('path', '/xlm');

// simple 
// form.submit(uploadUrl, (err, res) => {
//     if (err) throw err
//     console.log('Done :)')
// })

request.post('/upload', form, {
    headers: form.getHeaders()
})
.then((res) => {
    console.log(res.data);
    console.log('Done :)')
})
.catch((error) => {
    console.log('Something went wrong :(')
    console.log(error.response ? error.response.data : error.message);
});
