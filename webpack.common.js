const path = require('path');

module.exports = {
    performance: { hints: false },
    entry: './src/main.ts',

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'index.bundle.js'
    },
    resolve: {
        extensions: ['.ts', '.js']
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
    }
};
