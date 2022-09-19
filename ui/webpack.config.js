allowedHosts = ["all"];
module.exports = {
  resolve: {
    alias: {
      'react-dnd': path.resolve('../node_modules/react-dnd')
    }
  },
  resolve.fallback: {
    "util": require.resolve("util/"),
    'stream': require.resolve('stream-browserify'),
    'buffer': require.resolve('buffer/'),
    'assert': require.resolve('assert/'),
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ['buffer', 'Buffer'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.bin$/i,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      },
      {
        test: /\.abi$/i,
        use: [
          {
            loader: 'raw-loader',
          },
        ],
      },
    ],
  },
};
