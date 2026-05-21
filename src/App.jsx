import Layout from './layout/Layout'
import { BrowserRouter } from 'react-router'
import store from './store/store'
import { Provider } from 'react-redux'
import CustomToast from './components/CustomToast'
function App() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Layout/>
      </BrowserRouter>
      <CustomToast />
    </Provider>
  )
}

export default App
