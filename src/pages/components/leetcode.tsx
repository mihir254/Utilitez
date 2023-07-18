import { Button, Checkbox, Flex, Heading, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr } from "@chakra-ui/react";
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';

const LeetCode = () => {
    
    return (
        <Flex pt={10} flex={1} alignItems={"center"} direction={"column"}>
            <Flex mb={10}>
                <Button>Add</Button>
            </Flex>
            <TableContainer>
                <Table>
                    <Thead>
                        <Tr>
                            <Th><Heading size={"md"} color={"whiteAlpha.800"}>Status</Heading></Th>
                            <Th><Heading size={"md"} color={"whiteAlpha.800"}>Question</Heading></Th>
                            <Th><Heading size={"md"} color={"whiteAlpha.800"}>Difficulty</Heading></Th>
                            <Th><Heading size={"md"} color={"whiteAlpha.800"}>DSA</Heading></Th>
                            <Th><Heading size={"md"} color={"whiteAlpha.800"}>Time</Heading></Th>
                            <Th><Heading size={"md"} color={"whiteAlpha.800"}>Favorites</Heading></Th>
                            <Th><Heading size={"md"} color={"whiteAlpha.800"}>Solution</Heading></Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        <Tr>
                            <Td><Checkbox /></Td>
                            <Td><Heading size={"md"} color={"whiteAlpha.800"}>Name of the question</Heading></Td>
                            <Td>
                                <Flex border={"1px"} backgroundColor={"teal"} p={5} pt={0} pb={0} borderRadius={20}>
                                    <Text>Easy</Text>
                                </Flex>
                            </Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Data Structures / Algorithm</Heading>
                                </Flex>
                            </Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Time</Heading>
                                </Flex>
                            </Td>
                            <Td><AiFillStar color="white"/></Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Some Link</Heading>
                                </Flex>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td><Checkbox /></Td>
                            <Td><Heading size={"md"} color={"whiteAlpha.800"}>Name of the question</Heading></Td>
                            <Td>
                                <Flex border={"1px"} backgroundColor={"orange"} p={5} pt={0} pb={0} borderRadius={20}>
                                    <Text>Medium</Text>
                                </Flex>
                            </Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Data Structures / Algorithm</Heading>
                                </Flex>
                            </Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Time</Heading>
                                </Flex>
                            </Td>
                            <Td><AiOutlineStar color="white"/></Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Some Link</Heading>
                                </Flex>
                            </Td>
                        </Tr>
                        <Tr>
                            <Td><Checkbox /></Td>
                            <Td><Heading size={"md"} color={"whiteAlpha.800"}>Name of the question</Heading></Td>
                            <Td>
                                <Flex border={"1px"} backgroundColor={"brown"} p={5} pt={0} pb={0} borderRadius={20}>
                                    <Text>Hard</Text>
                                </Flex>
                            </Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Data Structures / Algorithm</Heading>
                                </Flex>
                            </Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Time</Heading>
                                </Flex>
                            </Td>
                            <Td><AiOutlineStar color="white"/></Td>
                            <Td>
                                <Flex>
                                    <Heading size="sm" color={"whiteAlpha.800"}>Some Link</Heading>
                                </Flex>
                            </Td>
                        </Tr>
                    </Tbody>
                </Table>
            </TableContainer>
        </Flex>
    )
}

export default LeetCode;