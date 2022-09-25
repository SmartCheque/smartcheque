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
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      console.error('here!!')
      const mod = resource.request.replace(/^node:/, "");

      switch (mod) {
        case "https":
          resource.request = "https-browserify";
          break;
        default:
          throw new Error(`Not found ${mod}`);
      }
    }),
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
