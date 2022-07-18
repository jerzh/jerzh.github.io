const path = require('path');

module.exports = {
  mode: 'production',
  entry: {
    'blog': './src/blog.ts',
    'cat-api': './src/cat-api.tsx',
    'domain-color': './src/domain-color.tsx',
  },
  // load using typescript
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'js'),
  },
};
