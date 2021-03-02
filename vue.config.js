module.exports = {
    configureWebpack: config => {
        config.output.filename = '[name].[hash:8].js'
        config.output.chunkFilename = '[name].[hash:8].js'
    },
}