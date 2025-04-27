const { getDefaultConfig } = require('@expo/metro-config');

const config = async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    ...defaultConfig,
    transformer: {
      ...defaultConfig.transformer,
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
      ...defaultConfig.resolver,
      assetExts: defaultConfig.resolver.assetExts.filter((ext) => ext !== 'svg'),
      sourceExts: [...defaultConfig.resolver.sourceExts, 'svg'],
    },
  };
};

module.exports = config();