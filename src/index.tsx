import ReactDOM from 'react-dom'
import './index.css'
import { App } from './components/app'
import reportWebVitals from './reportWebVitals'
import { ChakraProvider } from '@chakra-ui/react'
import { Provider } from 'reto'
import { GlobalIconConfigStore } from './stores/global-icon-config.store'

ReactDOM.render(
  <ChakraProvider>
    <Provider of={GlobalIconConfigStore} memo>
      <App />
    </Provider>
  </ChakraProvider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
