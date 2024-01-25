import {useState} from 'react'
import { Box, FormControl, Input, useDisclosure,useToast } from '@chakra-ui/react'
import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'
import React, { Children } from 'react'
import axios from 'axios'
import { ChatState } from '../../context/Chatprovider'
import UserListItem from '../UserAvatar/UserListItem'
import UserBadgeItem from '../UserAvatar/UserBadgeItem'

const GroupChatModal = ({children}) => {
    
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [groupChatName,setGroupChatName] = useState([]);
  const [selectedUsers,setSelectedUsers] = useState([]);
  const [search,setSearch] = useState("");
  const [searchResult,setSearchResult] = useState([]);
  const [loading,setLoading] = useState(false);
  
  const toast = useToast();

  const{user,chats,setChats} = ChatState();

  const handleSearch = async (query) =>{
     setSearch(query);

     if(query){
        return;
     }

     try{
       setLoading(true);

       const config = {
         headers :{
            Authorization:`Bearer ${user.token}`,
         },
       }

       const {data} = await axios.get(`/api/user?search=${search}`,config)
       console.log(data)
       setLoading(false)
       setSearchResult(data)

     } catch(err){
         toast({
            title:"Error Occured",
            description:"Failed to load the Search Results",
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom-left",
         })
     }
  }

  const handleSubmit = async() => {
     if(!groupChatName || !selectedUsers){
        toast({
            title:"Please fill all the fields",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"top",
        });
        return;
     }

     try{
       const config = {
         headers :{
            Authorization:`Bearer ${user.token}`,
         },
       };

       const {data} = await axios.post(
          "/api/chat/group",
          {
            name:groupChatName,
            users:JSON.stringify(selectedUsers.map((u) => u._id)),
          },
          config
       );
       setChats([data,...chats]);
        onClose();
        toast({
            title:"New Group Chat Created",
            status:"success",
            duration:5000,
            isClosable:true,
            position:"bottom",
        });
     } catch(err){
        toast({
            title:"Failed to Create the Chat!",
            description:err.response.data,
            status:"error",
            duration:5000,
            isClosable:true,
            position:"bottom",
        })
     }
  }

  const handleGroup = (userToAdd) => {
      if(selectedUsers.includes(userToAdd)){
         toast({
            title:"User already added",
            status:"warning",
            duration:5000,
            isClosable:true,
            position:"top",
         })
         return;
      }

      setSelectedUsers([...selectedUsers,userToAdd])
  }
  
  const handleDelete = (delUser) => {
     setSelectedUsers(selectedUsers.filter((sel) => sel._id!==delUser._id))
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >Create Group Chat</ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
           >
              <FormControl>
                  <Input 
                    placeholder="chat Name"
                    mb={3}
                    onChange={(e)=>setGroupChatName(e.target.value)}
                  />
              </FormControl>
              <FormControl>
                  <Input 
                    placeholder="Add Users eg: Smith,Kelvin"
                    mb={1}
                    onChange={(e)=>handleSearch(e.target.value)}
                  />
              </FormControl>
               {/* selected users */}
              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedUsers?.map((u) => (
                    <UserBadgeItem
                    key={user._id}
                    user={u}
                    handleFunction={()=>handleDelete(u)}
                    />
                ))}
              </Box>
              {/* render searched users */}
              {loading? <div>Loading</div> : (
                searchResult?.slice(0,4).map(user => (
                    <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)}/>
                ))
              )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' onClick={handleSubmit}>
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default GroupChatModal
