import { Box, Flex } from '@chakra-ui/react'
import Sidebar from './Sidebar'
import RoutesComponent from '../routes/RoutesComponent'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getCurrentUser } from '../service/authService'
import { setProfile } from '../store/profileSlice'

function App() {
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  useEffect(() => {
    if(localStorage.getItem('authentication-token')){
      (async ()=>{
        const response = await getCurrentUser();
        setUser(response.data);
        dispatch(setProfile(response.data));
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
    </Flex>
  )
}

export default App