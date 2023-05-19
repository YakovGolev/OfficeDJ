const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    performance: {
        hints: false,
        maxEntrypointSize: 512000,
        maxAssetSize: 512000
    },
    entry: {
        content_script: './src/content_script.ts',
        inject_content: './src/yandex_music/external_api/inject_content.ts',
        popup: './src/popup/popup.ts',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: '[name].bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules']
    },
    module: {
        rules: [
             {
                test: /\.svg$/,
                use: ['raw-loader']
            },
            {
                test: /\.(ts|js)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ["@babel/preset-env", {
                                targets: {
                                    browsers: "> 3%, not dead"
                                }
                            }],
                            "@babel/preset-typescript"
                        ],
                        plugins: [
                            "@babel/plugin-proposal-class-properties"
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: "manifest.json",
                    to: "[name][ext]",
                },
                {
                    from: "src/**/*.html",
                    to: "[name][ext]",
                }
            ]
        })
    ]
};
