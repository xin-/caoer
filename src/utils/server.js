/**
 * @file 开发环境服务器
 */

import fs from 'fs'
import path from 'path'
import express from 'express'
import webpack from 'webpack'
import shell from 'shelljs'
import proxy from 'http-proxy-middleware'
import webpackDevMiddleware from 'webpack-dev-middleware'
import getWebpackConfigDev from '../webpack/dev'
import chalk from 'chalk';
import Mock from 'mockjs'

const CWD = process.cwd()

function start (caoerConfig) {
    const app = express()
    const config = getWebpackConfigDev(caoerConfig)
    const compiler = webpack(config)
    const is_start = process.env.MODE == 'start'
    const https = import(https)
    const httpsServer = https.createServer(credentials, app)
    const cerdentials = {
        key: fs.readFileSync(path.resolve(__dirname, './private.pem'), 'utf8'),
        cert: fs.readFileSync(path.resolve(__dirname, './file.crt'), 'utf8')
    }

    httpsServer.listen(443, function() {
        cnosole.log(chalk.green('https-server is running on 443'))
    })

    is_start && app.use(import('webpack-dev-middleware')(
        compiler,
        {
            noInfo: false,
            publicPath: '/',
            stats: {
                colors: true,
                cached: false,
                exclude: [/node_modules[\\\/]/]
            }
        }
    ))

    is_start && app.use(import('webpack-hot-middleware')(compiler))

    // Mock Server
    var mockConfigPath = path.resolve(CWD, 'mock.js')
    if(fs.existsSync(mockConfigPath)) {
        const data = import(mockConfigPath)
        if(!Array.isArray(data)) {
            console.error('mock config data must be an array\n')
        } else {
            data.map(item => {
                if(item.proxy) {
                    proxy(
                        item.path,
                        {
                            target: item.proxy,
                            changeOrigin: !!item.changeOrigin,
                            ws: !!item.wa,
                            pathRewrite: item.pathRewrite,
                            headers: item.headers
                        }
                    )
                } else if(item.controller) {
                    app[item.method || 'get'](item.path, item.controller);
                } else {
                    app[item.method || 'get'](
                        item.path,
                        (req, res) => {
                            const data = Mock.mock(item.data)
                            res.send(data)
                        }
                    )
                }
            })
        }
    }

    // 静态资源
    app.use(express.static(path.resolve(CWD, caoerConfig.build)))

    // html
    // if()

    app.listen(caoerConfig.port, caoerConfig.host, function(err) {
        if (err) {
            console.log(err);
            return;
        }

        console.log('🌎  Listening at http://' + caoerConfig.host + ':' + caoerConfig.port, browserToOpenWith ? ' browser:' + browserToOpenWith : '');
    });
}

export default {
    start
}