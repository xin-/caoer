#!/usr/bin/env node
/**
 * @file 程序入口 源码
 */

import program from 'commander'
import config from '../package.json'
import path from 'path'
import fs from 'fs'
import shell from 'shelljs'
import tasks from './actions/index'

const CWD = process.cwd()

program
    .version(config.version, '-v, --version')
    .alias("cao")
    .description("a webpack-cli")
    .option('-p, --port', 'custom server port')
    .arguments('[mode] [name]')
    .action((mode, name) => {
        tasks[mode](name || program.port)
    })

program
    .command('xhl')
    .alias("xhldo")
    .description("do something")
    .arguments('[mode] [name]')
    .action((mode, name) => {
        console.log(mode, name)
        console.log(tasks)
    })

program.parse(process.argv)