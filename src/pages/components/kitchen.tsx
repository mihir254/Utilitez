import { Box, Button, Flex, Heading, Input, Text } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react";
import { IngredientType } from "@/src/interfaces/ingredient";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

const initialIngredientForm: IngredientType = {
    _id : '',
    name: '',
    details: '',
    nutrition: '',
    category: '',
}

type propType = {
    ingredients: IngredientType[],
}

const Kitchen = (props: propType) => {
    const [activeComponent, setActiveComponent] = useState <string> ('');
    const [ingredients, setIngredients] = useState <IngredientType[]> (props.ingredients);
    const [ingredientForm, setIngredientForm] = useState <IngredientType> (initialIngredientForm);

    const updateInput = (event: ChangeEvent<HTMLInputElement>) => {
        setIngredientForm(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value    
            }
        })
    }

    const handleSaveIngredient = async () => {
        setIngredients(prev => [...prev, ingredientForm]);
        // setIngredientForm(initialIngredientForm);
        let res = await fetch("/api/ingredients", {
            method: "POST",
            body: JSON.stringify(ingredientForm)
        });
        res = await res.json();
        console.log(res);
    }

    return (
        <Flex pl={2} pr={2} height="calc(100vh - 150px)">
            {/* <Flex direction={"column"}>
                <Input placeholder="name" color="white" name='name' value={ingredientForm.name} onChange={updateInput} />
                <Input placeholder="category" color="white" name='category' value={ingredientForm.category} onChange={updateInput} />
                <Input placeholder="nutrition" color="white" name='nutrition' value={ingredientForm.nutrition} onChange={updateInput} />
                <Input placeholder="details" color="white" name='details' value={ingredientForm.details} onChange={updateInput} />
                <Button onClick={handleSaveIngredient}>Save</Button>
            </Flex> */}
            {activeComponent === '' ? (
                    <Flex flex={1} justifyContent={"space-evenly"} alignItems={"center"}>
                        <Button onClick={() => setActiveComponent("Ingredients")} cursor={"pointer"} _hover={{ transform: "scale(1.02)" }} bgColor={"whiteAlpha.800"} rounded={20} width={"300px"} height={"300px"} justifyContent={"center"} alignItems={"center"} shadow={"xl"}>
                            <Heading size={"lg"}>ABC</Heading>
                        </Button>
                        <Button onClick={() => setActiveComponent("Dishes")} cursor={"pointer"} _hover={{ transform: "scale(1.02)" }} bgColor={"whiteAlpha.800"} rounded={20} width={"300px"} height={"300px"} justifyContent={"center"} alignItems={"center"} shadow={"xl"}>
                            <Heading size={"lg"}>DEF</Heading>
                        </Button>
                    </Flex>
                ) : activeComponent === 'Ingredients' ? (
                    <Box maxHeight={"calc(100vh - 150px)"} overflowY={"scroll"} pl={20} pr={20}>
                        <Flex wrap="wrap" justifyContent={"center"}>
                            {ingredients && ingredients.map((item, index) => (
                                <Flex _hover={{ transform: "scale(1.03)" }} m={5} rounded={15} shadow={"2xl"} p={5} backgroundColor={"blackAlpha.600"} justifyContent={"center"} alignItems={"center"} key={index}>
                                    <Flex color={"white"} width={"300px"} direction={"column"} p={5} pr={2} position={"relative"}>
                                        <Button bgColor={"whiteAlpha.700"} position={"absolute"} right={0} top={0} height={"50px"} width={"50px"} rounded={25}>
                                            <PiDotsThreeOutlineVerticalFill size={20} />
                                        </Button>
                                        <Heading size={"md"} p={2} pl={0}>{item.name}</Heading>
                                        <Text color={"whiteAlpha.700"}>Category: {item.category}</Text>
                                        <Text color={"whiteAlpha.700"}>Nutrition: {item.nutrition}</Text>
                                        <Text color={"whiteAlpha.700"}>Details: {item.details}</Text>
                                    </Flex>
                                </Flex>
                            ))}
                        </Flex>
                    </Box>
                ) : null
            }
            
            {activeComponent !== '' ? (
            <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} mt={5} left={5} height={"60px"} width={"60px"} rounded={30} onClick={() => setActiveComponent('')}>
                <FaArrowLeftLong size={25}/>
            </Button>) : null}
            {activeComponent !== '' ? (
            <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} mt={5} right={7} height={"60px"} width={"60px"} rounded={30}>
                <FaPlus size={25}/>
            </Button>) : null}
        </Flex>
    )
}

export default Kitchen;