#!/usr/bin/env bash
echo $1
git add .
git commit -m $1
git pull
echo '====>pulling'
git push
echo '====>pushing'