const webpack = require("webpack");

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
    if (stage === "build-html") {
        actions.setWebpackConfig({
            module: {
                rules: [
                    {
                        test: /web3-providers-ws/,
                        use: loaders.null(),
                    },
                ],
            },
        })
    }
    actions.setWebpackConfig({
        plugins: [
            new webpack.ProvidePlugin({
                Buffer: [require.resolve("buffer/"), "Buffer"],
                process: 'process/browser',
                btoa: ['base-64/base64', 'encode']                
            }),
        ],
        resolve: {
            fallback: {
                "crypto": false,
                "stream": require.resolve("stream-browserify"),
                "assert": false,
                "util": false,
                "http": false,
                "https": false,
                "os": false,
                "url": false
            },
        },
    })
}