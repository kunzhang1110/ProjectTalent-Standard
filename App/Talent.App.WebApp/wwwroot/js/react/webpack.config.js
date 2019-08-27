var webpack = require('webpack');

var Identity_URL = {
    production: "https://talentservicesidentity20190826095636.azurewebsites.net",
    development: "http://localhost:60998",
}

var Profile_URL = {
    production: "https://talentservicesprofile20190827111024.azurewebsites.net",
    development: "http://localhost:60290",
}

var Talent_URL = {
    production: "https://talentservicestalent20190827111426.azurewebsites.net",
    development: "http://localhost:51689",
}



module.exports = env => {
    var environment = env.NODE_ENV === 'production' ? 'production' : 'development';

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
        mode: environment,
        plugins: [
            new webpack.DefinePlugin({
                'Identity_URL': JSON.stringify(Identity_URL[environment]),
                'Profile_URL': JSON.stringify(Profile_URL[environment]),
                'Talent_URL': JSON.stringify(Talent_URL[environment]),
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