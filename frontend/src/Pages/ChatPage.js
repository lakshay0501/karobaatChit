import {Box} from '@chakra-ui/layout'
import ChatBox from "../components/ChatBox";
import { ChatState } from "../context/Chatprovider"
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { useState } from 'react';
import { set } from 'mongoose';

const ChatPage = () => {

  const {user} = ChatState();
  const [fetchAgain,setFetchAgain] = useState(false)
  // console.log(user)
  return (
    <div style={{width:'100%'}}>
      {user && <SideDrawer/>}  
    
    <Box display='flex' flexDirection='row' justifyContent='space-between' w="100%" h="91.5vh" p='10px'>
      {user && <MyChats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
      {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}
    </Box>
    
    </div>
  )
}

export default ChatPage
