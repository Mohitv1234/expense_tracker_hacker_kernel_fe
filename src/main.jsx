import { createRoot } from 'react-dom/client'
import './global.css'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import system from "./theme";
createRoot(document.getElementById('root')).render(
    <ChakraProvider  value={system}>
      <App />
    </ChakraProvider>
)
