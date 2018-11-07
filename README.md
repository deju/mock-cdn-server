

### 上传方式

- curl方式

        curl --form '/static/yarn.lock=@/xxx/simple-cdn-server/yarn.lock' --form 'path=xxxx'  http://localhost:3030/upload

- js方式

    见文件`examples/upload.js`


### 部署
需要`pm2`环境

    sh deploy.sh