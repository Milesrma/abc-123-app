const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
// Voice clips are shipped as compressed OGG (SPEC section 10).
config.resolver.assetExts.push('ogg');

module.exports = config;
