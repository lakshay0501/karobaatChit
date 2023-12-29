import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { ChatState } from '../context/Chatprovider'
import { Box, Button, Stack, typography, useToast } from '@chakra-ui/react';
import {Text} from '@chakra-ui/layout'
import { AddIcon } from '@chakra-ui/icons';
import ChatLoading from './ChatLoading';
import { getSender } from '../config/chatLogics';


const MyChats = () => {
  const [loggedUser,setLoggedUser] = useState();
  const {selectedChat,setSelectedChat,user,chats,setChats} = ChatState();

  const toast = useToast();

  const fetchChats = async() => {
     try{
       const config = {
         headers: {
            Authorization: `Bearer ${user.token}`,
         },
       };

       const {data} = await axios.get("/api/chat",config);
        
       setChats(data);
      // console.log(data)
      console.log("This is chats",chats,"This is data",data)
     } catch(err){
        
       toast({
         title:"Error Occured!",
         description:"Failed to load the chats",
         status:"error",
         duration:5000,
         isClosable:true,
         position:"bottom-left"   
       })
     }
  }

  useEffect(() =>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  },[])

  // console.log(chats)

  return (
    <Box
      display={{base:selectedChat ? "none" : "flex",md:"flex"}}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{base:"100%",md:"31%"}}
      borderRadius="1g"
      borderWidth="1px"
     >

     <Box
       pb={3}
       px={3}
       fontSize={{base:"28px" , md:"30px"}}
       fontFamily="Work sans"
       display="flex"
       width="100%"
       justifyContent="space-between"
       alignItems="center"  
     >
         My Chats

        <Button
          display="flex"
          fontSize={{base:"17px", md:"10px", lg:"17px"}}
          rightIcon={<AddIcon/>}
        >
           New Group Chat
        </Button>
      </Box>
  
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats.length>0 ? (
          <Stack overflowY="scroll">
             {chats.map((chat)=>{
              <Box
               onClick={() => setSelectedChat(chat)}
               cursor="pointer"
               bg={selectedChat===chat ? "#38B2AC" : "#E8E8E8"}
               color={selectedChat===chat ? "white" : "black"}
               px={3}
               py={2}
               borderRadius="lg"
               key={chat._id}
              >
                <Text>
                   {!chat.isGroupChat ? getSender(loggedUser,chat.users)
                   : chat.chatName}
                </Text>

              </Box>
             })}
          </Stack>
        ):(
          <ChatLoading/>
        )}
      </Box>
    </Box>
  )
}

export default MyChats
