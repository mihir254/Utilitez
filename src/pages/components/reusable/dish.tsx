import { Divider, Flex, Heading, Text } from "@chakra-ui/react"

const Dish = () => {
    return (
        <Flex borderRadius={10} p={3} pl={5} pr={5} border={"1px"} bgColor="white" maxW={"500px"}>
            <Flex direction={"column"}>
                <Text>
                    <Heading size={"lg"}>NAME OF THE DISH</Heading>
                </Text>
                <Text>
                    <Heading size={"md"}>Cuisine</Heading>
                </Text>
                <Flex mt={5} flexWrap={"wrap"}> 
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(() => (
                        <Flex p={1} rounded={8} mt={2} mr={5} border={"1px"}>
                            <Text>hello</Text>
                        </Flex>
                    ))}
                </Flex>
            </Flex>
            <Divider orientation="vertical" mr={2} ml={2} />
            <Flex alignItems={"center"} justifyContent={"center"}>
                <Flex border={"1px"} height={"150px"} width={"150px"}>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Dish;