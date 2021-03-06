const config = require('./config');
const layout = require('./layout');
const assets = require('../common/assets');
const getTranslator = require('./locale');
const { getFxaConfig } = require('./fxa');

module.exports = async function(req) {
  const locale = req.language || 'en-US';
  let authConfig = null;
  if (config.fxa_client_id) {
    try {
      authConfig = await getFxaConfig();
      authConfig.client_id = config.fxa_client_id;
    } catch (e) {
      // continue without accounts
    }
  }
  return {
    archive: {
      numFiles: 0
    },
    locale,
    capabilities: { account: false },
    translate: getTranslator(locale),
    title: 'Firefox Send',
    description:
      'Encrypt and send files with a link that automatically expires to ensure your important documents don’t stay online forever.',
    baseUrl: config.base_url,
    ui: {},
    storage: {
      files: []
    },
    fileInfo: {},
    cspNonce: req.cspNonce,
    user: { avatar: assets.get('user.svg'), loggedIn: false },
    route: req.route ? req.route.path : null,
    authConfig,
    layout
  };
};
