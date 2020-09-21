const { override, fixBabelImports, addLessLoader } = require('customize-cra');

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: true,
  }),
  addLessLoader({
    lessOptions: {
      javascriptEnabled: true,
      modifyVars: {
        'body-background': '#2c2f33',
        '@btn-default-bg': '#23272A',
        '@primary-color': '#ff024f', // This needs to be modified as we go
        '@text-color-secondary': '#b9b9b9',
        '@text-color': '#fff',
        'layout-body-background': '#2c2f33',
        // Alert background
        '@message-notice-content-bg': '#23272A',
        // Dashboard navbar colors
        '@menu-bg': '#202225',
        // Modal colors
        '@modal-header-bg': '#202225',
        '@modal-footer-bg': '#202225',
        '@modal-content-bg': '#2f3136',
        // Select colors
        '@select-background': '#23272A',
        '@select-dropdown-bg': '#23272A',
        '@select-selection-item-bg': '#23272A',
        '@select-item-selected-bg': '#2f3136',
        '@select-selection-item-bg': '#2f3136',
        '@select-item-active-bg': '#2f3136',
      },
    },
  })
);
