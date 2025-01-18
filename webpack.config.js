const path = require('path');

module.exports =  {
  mode: 'development',
  entry: '/src/index.jsx',
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, './public')
  },

  devServer: {
    static: {
      directory: path.join(__dirname, './public')
    },
    open: false,
    port: 1337,
    historyApiFallback: true
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ]
      }
    ]
  },

  devtool: 'source-map'
}
