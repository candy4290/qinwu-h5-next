
# 常用命令

开发
npm run dev

打包
npm run build;将public复制到.next/standalone,将.next/static复制到.next/standalone/.next

部署
.next/standalone文件独立部署；
windows中部署命令set PORT=56667 && pm2 start server.js --name qinwu-h5
linux中部署PORT=56667 pm2 start server.js --name qinwu-h5
