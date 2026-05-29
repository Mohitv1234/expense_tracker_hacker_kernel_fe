import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import RoutesComponent from '../routes/RoutesComponent'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from '../service/authService'
import { setProfile } from '../store/profileSlice'
import Socket from '../components/Socket'

function App() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if(localStorage.getItem('authentication-token')){
      (async ()=>{
        const response = await getCurrentUser();
        if(response.data){
          setUser(response.data);
          dispatch(setProfile(response.data));
          if(window.location.pathname.includes('login')){
            window.location.replace('/')
          }
        }else{
          localStorage.setItem('authentication-token', '');
          window.location.reload();
        }
      })()
    }
  },[])
  return (
    <Flex
      minH={'100vh'}
      bg={'#f6f1ff'}
      overflow={'hidden'}
    >
      {/* Sidebar */}
      {user && <Sidebar />}

      {/* Main Content */}
      <Box
        flex={1}
        overflowY={'auto'}
        h={'100vh'}
      >
        <RoutesComponent />
      </Box>
        {user && <Socket/>}
    </Flex>
  )
}

export default App