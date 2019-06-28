/**
 * @file tasks cli支持的任务列表页
 */

import chalk from 'chalk'
import shell from 'shelljs'
import path from 'path'
import fs from 'fs'
import caoerConfig from '../utils/config'
import server from '../utils/server'
import loading from 'ora'

const CWD = process.cwd()
const load = loading({
    text: chalk.blue('Loading template...\n'),
})

const tasks = {
    init(name) {
        if(!name || !name.length) {
            console.log(chalk.red('ERROR:: App name is required'))
            process.exit(1)
        }

        load.start()

        shell.cp('-R',
            path.resolve(__dirname, `../templates/${name}/app`),
            path.resolve(CWD, name)
        )

        load.stop()

        console.log(chalk.green(`项目 ${name} 创建成功`))
    },

    start(port) {
        load.start()

        const check_modules = () => {
            if(!fs.existsSync(path.resolve(CWD, 'node_modules'))) {
                console.log(chalk.green('installing npm packages ... \n'))
                shell.exec('npm install')
            }
        }

        check_modules()
        process.env.MODE = 'start'
        port && (caoerConfig.port = port)
        server.start(caoerConfig)
        
        load.stop()
    }
}

export default tasks