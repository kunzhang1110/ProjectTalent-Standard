var webpack = require('webpack');

var Identity_URL = {
    production: "https://talentservicesidentity20190826095636.azurewebsites.net",
    development: "http://localhost:60998",
}

var environment = process.env.NODE_ENV === 'production' ? 'production' : 'development';

module.exports = env => {


    return {
        context: __dirname,
        entry: {
            homePage: './ReactScripts/Home.js'
        },
        output:
        {
            path: __dirname + "/dist",
            filename: "[name].bundle.js"
        },
        watch: true,
        mode: 'production',
        plugins: [
            new webpack.DefinePlugin({
                'Identity_URL': Identity_URL[environment]
            })
        ],
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /(node_modules)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['babel-preset-env', 'babel-preset-react']
                        }
                    }
                },
                {
                    test: /\.css$/,
                    loaders: [
                        'style-loader',
                        'css-loader?modules'
                    ]
                }
            ]
        }
    }
}