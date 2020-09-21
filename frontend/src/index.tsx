import React from 'react';
import App from './App';
import { StoreProvider } from 'easy-peasy';
import { render } from 'react-dom';
import { Spin } from 'antd';
import store from './store';

// Not using less loader due to time it takes to load, making the spinner useless
render(<Spin style={{ position: 'absolute', width: '100%', height:' 100%', display: 'flex', justifyContent: 'center',alignItems: 'center'}} />, document.getElementById('root'));

store.dispatch.member.verifyOauth().finally(() => {
  render(
    <StoreProvider store={store}>
      <App />
    </StoreProvider>,
    document.getElementById('root')
  );
});
