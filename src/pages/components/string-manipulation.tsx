import { Flex, Text, Stack, FormControl, FormLabel, Input, Button, Heading, Box, useColorModeValue, IconButton, useToast, CloseButton } from "@chakra-ui/react";
import { useState } from "react";
import axios from 'axios';
import { PiCopySimpleBold } from "react-icons/pi";

const StringManipulation = () => {
    const [text, setText] = useState('');
    const [del, setDel] = useState('');
    const [answer, setAnswer] = useState('...');
    const shadowColor = useColorModeValue('gray.200', 'white');
    const toast = useToast();

    const runPython = async () => {
      try {
        await axios.post('/api/run-python', { text, del })
        .then(res => setAnswer(res.data.message))
        .catch(err => console.log(err));
      } catch (err) {
        console.error(err);
      }
    };
  
    const runTypeScript = () => {
      const nextText = text.trim();
      const newArray = nextText.split(" ");
      const newStr = newArray.join(del);
      setAnswer(newStr);
    }

    const refreshScreen = () => {
      setText('');
      setDel('');
      setAnswer('...');
    }

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(answer);
        toast({
          duration: 1500,
          position: "bottom-left",
          render: () => (
            <Flex rounded={20} height={"40px"} width={"150px"} justifyContent={"center"} alignItems={"center"} bgColor={"blackAlpha.700"} color={"whiteAlpha.700"}>
              <Text>Text Copied!</Text>
            </Flex>
          )
      });
      } catch (err) {
        console.error("Failed to copy: ", err);
      }
    }
    
    return (
        <Flex flex={1} justifyContent={"center"} alignItems={"center"} direction={"column"}>
        <Flex rounded={25} m={10} direction={"column"} width={{md: "600px", base: "350px"}} p={10} justifyContent={"space-around"} alignItems={"center"} mb={10} backgroundColor={"blackAlpha.900"}>
              <Box width={{md: "400px", base: "250px"}}>
                  <Flex direction={"column"}>
                      <FormControl mr={20} mb={5}>
                          <FormLabel
                              textTransform='uppercase'
                              fontSize={"var(--chakra-fontSizes-sm)"}
                              fontWeight={"var(--chakra-fontWeights-bold)"}
                              fontFamily={"var(--chakra-fonts-heading)"}
                              color={"whiteAlpha.800"}
                              >
                              String
                          </FormLabel>
                          <Input color={"whiteAlpha.800"} name="string" value={text} onChange={e => setText(e.target.value)} />
                      </FormControl>
                      <FormControl>
                          <FormLabel
                              textTransform='uppercase'
                              fontSize={"var(--chakra-fontSizes-sm)"}
                              fontWeight={"var(--chakra-fontWeights-bold)"}
                              fontFamily={"var(--chakra-fonts-heading)"}
                              color={"whiteAlpha.800"}
                              >
                              Delimitter
                          </FormLabel>
                          <Input color={"whiteAlpha.800"} name="delimitter" value={del} onChange={e => setDel(e.target.value)}/>
                      </FormControl>
                  </Flex>
              </Box>
              <Flex mt={10} direction={{md: "row", base: "column"}} justifyContent={"space-evenly"} alignItems={"center"}>
                <Button isDisabled mt={{md: 0, base: 5}} width={"100px"} onClick={runPython} backgroundColor={"#666"} mr={{md: 10, base: 0}} _hover={{ backgroundColor: "#555" }} color={"whiteAlpha.800"}>PY</Button>
                <Button mt={{md: 0, base: 5}} width={"150px"} onClick={runTypeScript} colorScheme="teal" mr={{md: 10, base: 0}}>TS</Button>
                <Button mt={{md: 0, base: 5}} width={"100px"} onClick={refreshScreen} backgroundColor={"#666"} _hover={{ backgroundColor: "#555" }} color={"whiteAlpha.800"}>Refresh</Button>
              </Flex>
        </Flex>
          <Flex rounded={25} m={5} width={{md: "600px", base: "350px"}} justifyContent={"space-between"} alignItems={"center"} backgroundColor={"blackAlpha.900"}>
            <Flex justifyContent={"center"} alignItems={"center"} p={8} flex={1}>
              <Heading color={"whiteAlpha.800"} size={"md"}>{answer}</Heading>
            </Flex>
            {answer !== "" && answer !== "..." ? <IconButton colorScheme="whiteAlpha" m={2} aria-label={""} onClick={handleCopy}><PiCopySimpleBold color="white" size={22} /></IconButton> : null}
          </Flex>
      </Flex>
    )
}

export default StringManipulation;