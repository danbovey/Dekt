import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import './css/global.css';
import 'react-dd-menu/dist/react-dd-menu.css';
import './css/react-dd-menu.css'

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
