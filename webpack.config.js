const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const optimization = () => {
const config = {
    splitChunks:{
        chunks: 'all'
    }
}
if (isProd){
    config.minimizer = [
        new OptimizeCssAssetsPlugin(),
        new TerserPlugin()
    ]
}
return config

}
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true
            },
       }, 
       'css-loader'
    ]
    if(extra){
        loaders.push(extra)
    }
    return loaders
}

module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill','./index.js'],
       adaptive: './js/adaptiveMenu.js'
       
        

    },
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
    },
    optimization: optimization(),
    devServer:{
        port: 4200,
        hot: isDev
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: './index.html',
            minify: {
                collapseWhitespace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin({
            patterns: [{
                    from: './assets/favicon',
                    to: './favicon'
                },
                {
                    from: './assets/image',
                    to: './image'
                },
                {
                    from: './assets/fonts',
                    to: './fonts'
                },
                {
                    from: './assets/video',
                    to: './video'
                }
            ]
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
            allChunks: true
        })
    ],
    module: {
        rules: [{
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')

            },
            {
                test: /\.(png|jpg|svg|gif|jpeg|webp)$/,
                use: ['file-loader']
            },
            {
                test: /\.(ttf|woff|svg|woff2|eot)$/,
                use: ['file-loader']
            },
            { 
                test: /\.js$/,
                 exclude: /node_modules/, 
                 loader: {
                     loader: 'babel-loader',
                     options: {
                         presets: [
                             '@babel/preset-env'
                         ]
                     }
                    }
             }
  
        ]
    }
};