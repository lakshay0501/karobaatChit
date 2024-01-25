import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, typography, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/Chatprovider'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'
import axios from 'axios'
const UpdateGroupChatModal = (fetchAgain,setFetchAgain) => {
    
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [groupChatName,setGroupChatName] = useState();
    const [search,setSearch] = useState("");
    const [searchResult,setSearchResult] = useState([])
    const [loading,setLoading] = useState(false)
    const {selectedChat,setSelectedChat,user} = ChatState();
    const [renameLoading,setRenameLoading] = useState(false);

    const handleRemove = () =>{

    }

    const handleRename = async() => {
        if(!groupChatName){
            return;
        }
        try{
            setRenameLoading(true)

            const config = {
                headers:{
                    Authorization:`Bearer ${user.token}`,
                },
            }

            const {data} = await axios.put(`/api/chat/rename`,
            {
                chatId:selectedChat._id,
                chatName:groupChatName,
            },
             config
            );
            console.log(data._id)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain);
            setRenameLoading(false)

        } catch(err){
          if(err.response){
           toast({
             title:"Error Occured",
             description:err.response.data.message,
             status:"error",
             duration:5000,
             isClosable:true,
             position:"bottom",
           })
          }
          else{
            toast({
             title:"Error Occured",
             description:'Unexpected error!',
             status:"error",
             duration:5000,
             isClosable:true,
             position:"bottom",
           })
          }
           setRenameLoading(false)
        }

        setGroupChatName("")
    }

    const handleSearch = () => {

    }

    const toast = useToast();
    return (
     <>
      <IconButton d={{base:"flex"}} icon={<ViewIcon/>} onClick={onOpen}/>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >{selectedChat.chatName}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
            {selectedChat?.users.map((u)=>(
                <UserBadgeItem
                  key={user._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
            ))}
            </Box>
            <FormControl display="flex">
                <Input
                  placeholder="Chat Name"
                  mb={3}
                  value={groupChatName}
                  onChange={(e)=>setGroupChatName(e.target.value)}
                />
                <Button
                  variant="solid"
                  colorScheme="teal"
                  ml={1}
                  isLoading={renameLoading}
                  onClick={handleRename}
                >
                    Update
                </Button>
            </FormControl>
            <FormControl>
                <Input
                  placeholder="Add user to group"
                  mb={1}
                  onChange={(e)=>handleSearch(e.target.value)}
                />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button display="flex" onClick={() => handleRemove(user)} colorScheme="red">
                Leave red
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
