import { Provider } from "react-redux"
import { createRoot } from "react-dom/client"
import { store } from "./store"
import './index.css';
import App from './App';
import * as serviceWorker from "./serviceWorker"
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers"
import { DndProvider } from 'react-dnd'
import { TouchBackend } from 'react-dnd-touch-backend'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { isMobile } from 'react-device-detect';

import './i18n'

function getLibrary(provider : any) {
  return new Web3Provider(provider);
}

const rootElement = document.getElementById("root");
if (rootElement){
  const root = createRoot(rootElement);

  root.render(
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <DndProvider
          backend={isMobile ? TouchBackend : HTML5Backend}
          //options={{ enableMouseEvents: true, preview: true }}
          >
          <App />
        </DndProvider>
      </Web3ReactProvider>,
    </Provider>,
  )
}

// If you want your app to work offline and load faster, you can chađinge
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
