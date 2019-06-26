const path = require('path');
const config = require("./webpack.config.common.js");

module.exports = Object.assign(
    config,
    {
        devServer: {
            contentBase: path.resolve(__dirname, '../dist'),
            host: '0.0.0.0',
            port: 3000,
            hot: true,
        },

        
    }
)