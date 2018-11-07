#!/bin/bash


yarn install

pm2 delete simple-cdn-server
pm2 start npm --name="simple-cdn-server" -- run server
