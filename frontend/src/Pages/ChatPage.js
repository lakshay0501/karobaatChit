import {Box} from '@chakra-ui/layout'
import ChatBox from "../components/ChatBox";
import { ChatState } from "../context/Chatprovider"
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";

const ChatPage = () => {

  const {user} = ChatState();
 
  // console.log(user)
  return (
    <div style={{width:'100%'}}>
      {user && <SideDrawer/>}  
    
    <Box display='flex' flexDirection='row' justifyContent='space-between' w="100%" h="91.5vh" p='10px'>
      {user && <MyChats/>}
      {user && <ChatBox/>}
    </Box>
    
    </div>
  )
}

export default ChatPage
