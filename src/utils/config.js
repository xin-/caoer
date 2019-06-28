/**
 * @file 获取caoer config
 * notice: 
 *  1. 使用async函数需要babel-polyfill
 *  2. 使用异步import 需要babel-plugin-dynamic-import-node
 *  // 3. 如果要在代码中中使用异步import 可以使用plugin-syntax-dynamic-import
 */

import 'babel-polyfill';
import fs from "fs"
import path from 'path'
import defaultCaoer from './caoer.config'

const CWD = process.cwd()

/**
 * @file get caoer.config.js
 */

let caoer = null

const getCaoer = (async function() {

    const filePath = path.resolve(CWD, 'caoer.config.js')

    if(fs.existsSync(filePath)) {

        const caoer = await import(filePath)

        caoer = {
            ...defaultCaoer,
            ...caoer
        }
        
    }

    caoer = defaultCaoer

})()

export default caoer