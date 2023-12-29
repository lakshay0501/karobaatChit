import React , {useState} from 'react'
import axios from 'axios'
import { FormControl, FormLabel, InputGroup, InputRightElement, VStack,Button, useToast } from '@chakra-ui/react'
const {Input} = require('@chakra-ui/react')
const {useHistory} = require('react-router-dom')
const Signup = () => {

  const [show,setShow] = useState(false)
  const [name,setName] = useState()
  const [email,setEmail] = useState()
  const [confirmpassword,setconfirmPassword] = useState()
  const [password,setPassword] = useState();
  const [pic,setPic] = useState()  
  const [loading,setLoading] = useState(false)
  const toast = useToast();
  const history = useHistory();
  
  const handleClick = () => setShow(!show);
   
  const submitHandler = async() => {

     setLoading(true);
     if(!name || !email || !password || !confirmpassword){
       toast({
         title:"Please fill all the fields",
         status:"warning",
         duration:5000,
         isClosable:true,
         position:"bottom",
       });
       setLoading(false)
       return;
     }

     if(password!==confirmpassword){
      toast({
         title:"Passwords does not match",
         status:"warning",
         duration:5000,
         isClosable:true,
         position:"bottom",
      })
      return;
     }

     try{
       const config = {
          headers:{
             "Content-type":"application/json",
          },
       };

       const {data} = await axios.post("/api/user",
       {name,email,password,pic},
        config
       );

      //  const {data} = await axios({"post":"/api/user",
      //  "data":{name,email,password,pic},
      //  config})

       toast({
          title:"Registration Successful",
          status:"success",
          duration:5000,
          isClosable:true,
          position:"bottom",
       })
        
       localStorage.setItem("userInfo",JSON.stringify(data));
       setLoading(false)
       history.push('/chats')
     } catch(err){
        console.log(`Error in submission : ${err}`)
        setLoading(false)
     }
  }
  const postDetails = (pics) => {
     setLoading(true)
     if(pics===undefined){
       toast({
         title:"Please Select an Image!",
         status:"warning",
         duration:5000,
         isClosable:true,
         position:"bottom",
       })
       return;
     }

     if(pics.type==="image/jpeg" || pics.type==="image/png"){
      const data = new FormData();
      data.append("file",pics);
      data.append("upload_preset","Karo-Baatchit");
      data.append("cloud_name","dtnh3yibm");
      fetch("https://api.cloudinary.com/v1_1/dtnh3yibm/image/upload",{
         method:'post',
         body:data,
      }).then((res)=>res.json())
        .then(data => {
         setPic(data.url.toString());
         console.log(data.url.toString());
         setLoading(false)
        })
        .catch((err) => {
          console.log(err);
          setLoading(false)
        })
     } else{
        toast({
         title:"Please Select an Image!",
         status:"warning",
         duration:5000,
         isClosable:true,
         position:"bottom",
       })
       setLoading(false)
       return;
     }
  }
  return (
    <VStack spacing="5px">
         <FormControl>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter your Name'
            onChange={(e)=>setName(e.target.value)}/>
         </FormControl>
         <FormControl>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter your Email'
            onChange={(e)=>setEmail(e.target.value)}/>
         </FormControl>
         <FormControl>
            <FormLabel>Password</FormLabel>
            <InputGroup>
                <Input type={show? "text" : "password"} placeholder='Enter your Password'
                 onChange={(e)=>setPassword(e.target.value)}/>
                 <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                 </InputRightElement>
            </InputGroup>
         </FormControl>

         <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup>
                <Input type={show? "text" : "password"} placeholder='Enter your Password'
                 onChange={(e)=>setconfirmPassword(e.target.value)}/>
                 <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleClick}>
                        {show ? "Hide" : "Show"}
                    </Button>
                 </InputRightElement>
            </InputGroup>
         </FormControl>

         <FormControl id='pic'>
            <FormLabel>Upload your picture</FormLabel>
            <Input type={"file"} p={1.5} accept='image/*'
                 onChange={(e)=>postDetails(e.target.files[0])}/>
         </FormControl>
         <Button
           colorScheme='blue'
           width="100%"
           style={{marginTop:15}}
           onClick={submitHandler}
           isLoading={loading}
         >
           Signup
         </Button>
    </VStack>
  );
}

export default Signup
