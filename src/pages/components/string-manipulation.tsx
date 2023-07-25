import { Flex, Card, Stack, FormControl, FormLabel, Input, Button, Heading, Box, useColorModeValue } from "@chakra-ui/react";
import { useState } from "react";
import axios from 'axios';

const StringManipulation = () => {
    const [text, setText] = useState('');
    const [del, setDel] = useState('');
    const [answer, setAnswer] = useState('...');
    const shadowColor = useColorModeValue('gray.200', 'white');

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
      setAnswer('');
    }
    
    return (
        <Flex flex={1} justifyContent={"center"} alignItems={"center"} direction={"column"}>
        <Flex direction={"column"} width={{md: "600px", base: "350px"}} p={10} justifyContent={"space-around"} alignItems={"center"} mb={10} backgroundColor={"blackAlpha.900"}>
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
                <Button mt={{md: 0, base: 5}} width={"100px"} onClick={runPython} backgroundColor={"#666"} mr={{md: 10, base: 0}} _hover={{ backgroundColor: "#555" }} color={"whiteAlpha.800"}>PY</Button>
                <Button mt={{md: 0, base: 5}} width={"150px"} onClick={runTypeScript} colorScheme="teal" mr={{md: 10, base: 0}}>TS</Button>
                <Button mt={{md: 0, base: 5}} width={"100px"} onClick={refreshScreen} backgroundColor={"#666"} _hover={{ backgroundColor: "#555" }} color={"whiteAlpha.800"}>Refresh</Button>
              </Flex>
        </Flex>
        <Card width={{md: "600px", base: "350px"}} p={10} justifyContent={"space-around"} alignItems={"center"} backgroundColor={"blackAlpha.900"}>
          <Heading color={"whiteAlpha.800"} size={"md"}>{answer}</Heading>
        </Card>
      </Flex>
    )
}

export default StringManipulation;