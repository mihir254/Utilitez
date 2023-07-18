import { Box, Button, Editable, EditableInput, EditablePreview, Flex, Heading, Input, Modal, ModalOverlay, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Select, Text, Textarea } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react";
import { IngredientType } from "@/src/interfaces/ingredient";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import { MdOutlineDone } from "react-icons/md";
import IngredientComponent from "./ingredient";
import { DishType } from "@/src/interfaces/dish";

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
    const [selectedIngredients, setSelectedIngredients] = useState <string[]> ([]);

    const [dishes, setDishes] = useState <DishType[]> ([]);

    const [createEntry, setCreateEntry] = useState <boolean> (false);

    const updateInput = (event: ChangeEvent<HTMLInputElement>) => {
        setIngredientForm(prev => {
            return {
                ...prev,
                [event.target.name]: event.target.value    
            }
        })
    }

    const updateSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        setSelectedIngredients(prev => [...prev, event.target.value]);
    }

    const handleSaveIngredient = async () => {
        let res = await fetch("/api/ingredients", {
            method: "POST",
            body: JSON.stringify(ingredientForm)
        });
        if (res.ok) {
            const data = await res.json();
            setIngredientForm(prev => prev._id = data.message.insertedId);
            setIngredients(prev => [ingredientForm, ...prev]);
        }
        setCreateEntry(false);
        setIngredientForm(initialIngredientForm);
    }

    const handleCancelIngredient = () => {
        setIngredientForm(initialIngredientForm);
        setSelectedIngredients([]);
        setCreateEntry(false);
    }

    const handleCreateEntry = () => {
        setCreateEntry(true);
    }

    return (
        <Flex pl={2} pr={2} height="calc(100vh - 150px)" position={"relative"}>
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
                    <Box maxHeight={"calc(100vh - 150px)"} minWidth={"100%"} overflowY={"scroll"} pl={20} pr={20}>
                        <Flex wrap="wrap" justifyContent={"center"}>
                            {createEntry ? (
                                <Flex m={5} rounded={15} shadow={"2xl"} p={5} backgroundColor={"blackAlpha.600"} justifyContent={"center"} alignItems={"center"} style={{boxShadow: "5px 5px 8px rgba(200, 200, 200, 0.5"}}>
                                    <Flex color={"white"} width={"300px"} direction={"column"} p={0} pr={2} position={"relative"}>
                                        <Button disabled={initialIngredientForm === ingredientForm} bgColor={"whiteAlpha.700"} position={"absolute"} right={0} top={0} height={"50px"} width={"50px"} rounded={25}>
                                            <MdOutlineDone size={20} onClick={handleSaveIngredient}/>
                                        </Button>
                                        <Flex direction={"column"}>
                                            <Flex alignItems={"center"}>
                                                <Text color="whiteAlpha.800" fontSize={16}>Name: </Text>
                                                <Input autoFocus fontWeight={"700"} ml={3} width={"150px"} variant={"flushed"} color="white" name='name' value={ingredientForm.name} onChange={updateInput} />
                                            </Flex>
                                            <Flex alignItems={"center"}>
                                                <Text color="whiteAlpha.800" fontSize={16}>Category: </Text>
                                                <Input ml={3} variant={"flushed"} color="white" name='category' value={ingredientForm.category} onChange={updateInput} />
                                            </Flex>
                                            <Flex alignItems={"center"}>
                                                <Text color="whiteAlpha.800" fontSize={16}>Nutrition: </Text>
                                                <Input ml={3} variant={"flushed"} color="white" name='nutrition' value={ingredientForm.nutrition} onChange={updateInput} />
                                            </Flex>
                                            <Flex alignItems={"center"}>
                                                <Text color="whiteAlpha.800" fontSize={16}>Details: </Text>
                                                <Input ml={3} variant={"flushed"} color="white" name='details' value={ingredientForm.details} onChange={updateInput} p={0}/>
                                            </Flex>
                                        </Flex>
                                    </Flex>
                                </Flex>
                            ) : null}
                            {ingredients && ingredients.map((item, index) => (
                                <IngredientComponent setIngredients={setIngredients} item={item} key={index}/>
                            ))}
                        </Flex>
                    </Box>
                ) : activeComponent === "Dishes" ? (
                    <Box maxHeight={"calc(100vh - 150px)"} minWidth={"100%"} overflowY={"scroll"} pl={20} pr={20}>
                        <Flex wrap="wrap" justifyContent={"center"}>
                            {createEntry ? (
                                                                <Flex m={5} rounded={15} shadow={"2xl"} p={5} backgroundColor={"blackAlpha.600"} justifyContent={"center"} alignItems={"center"} style={{boxShadow: "5px 5px 8px rgba(200, 200, 200, 0.5"}}>

                                <Flex direction={"column"} minHeight={"500px"} justifyContent={"space-evenly"} width={"90%"} alignItems={"center"}>
                                    <Flex alignItems={"flex-end"}>
                                        <Text width={"140px"} color="whiteAlpha.800" fontWeight={"bold"} fontSize={16}>Name: </Text>
                                        <Input variant={"flushed"} color="white" name='name' value={ingredientForm.name} onChange={updateInput} />
                                    </Flex>
                                    <Flex alignItems={"flex-end"}>
                                        <Text color="whiteAlpha.800" fontWeight={"bold"} fontSize={16} width={"140px"}>Cuisine: </Text>
                                        <Input variant={"flushed"} color="white" name='category' value={ingredientForm.category} onChange={updateInput} />
                                    </Flex>
                                    <Flex alignItems={"flex-end"}>
                                        <Text color="whiteAlpha.800" fontWeight={"bold"} fontSize={16} width={"140px"}>Nutrition: </Text>
                                        <Input variant={"flushed"} color="white" name='nutrition' value={ingredientForm.nutrition} onChange={updateInput} />
                                    </Flex>
                                    <Flex alignItems={"flex-end"}>
                                        <Text color="whiteAlpha.800" fontWeight={"bold"} fontSize={16} width={"140px"}>Preferred Meal: </Text>
                                        <Input variant={"flushed"} color="white" name='nutrition' value={ingredientForm.nutrition} onChange={updateInput} />
                                    </Flex>
                                    <Flex alignItems={"flex-end"} width={"100%"}>
                                        <Text color="whiteAlpha.800" fontWeight={"bold"} fontSize={16} width={"140px"}>Ingredients: </Text>
                                        <Select placeholder='Select option' variant={"flushed"} onChange={updateSelect}>
                                            {ingredients.map((ingredient) => (
                                                <option key={ingredient.id} value={ingredient.name}>
                                                    {ingredient.name}
                                                </option>
                                            ))}
                                        </Select>
                                    </Flex>
                                    <Flex wrap={"wrap"}>
                                        {selectedIngredients.map((ingredient) => (
                                            <Button m={2} onClick={() => setSelectedIngredients(prev => prev.filter(ing => ing !== ingredient))}>
                                                <Text key={ingredient}>{ingredient}</Text>
                                            </Button>
                                        ))}
                                    </Flex>
                                    <Flex width={"100%"} justifyContent={"space-evenly"}>
                                        <Button minWidth={"100px"} onClick={handleSaveIngredient}>Save</Button>
                                        <Button minWidth={"100px"} onClick={handleCancelIngredient}>Cancel</Button>
                                    </Flex>
                                </Flex></Flex>
                            ) : null}
                            {dishes && dishes.map((item, index) => (
                                <Flex></Flex>
                            ))}
                        </Flex>
                    </Box>
                ) : null}
            {activeComponent !== '' ? (
                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} mt={5} left={5} height={"60px"} width={"60px"} rounded={30} onClick={() => {setActiveComponent(''); setCreateEntry(false);}}>
                    <FaArrowLeftLong size={25}/>
                </Button>
            ) : null}
            {activeComponent !== '' ? (
                <>
                    {createEntry ? (
                        <Button
                            _hover={{ transform: "scale(1.02)" }}
                            bgColor={"white"}
                            shadow={"xl"}
                            position={"absolute"}
                            top={5}
                            right={7}
                            height={"60px"}
                            width={"60px"}
                            rounded={30}
                            onClick={handleCancelIngredient}
                        >
                            <FaPlus size={25} style={{ transform : "rotate(45deg)" }}/>
                        </Button>
                        ) : (
                        <Button
                            _hover={{ transform: "scale(1.02)" }}
                            bgColor={"white"}
                            shadow={"xl"}
                            position={"absolute"}
                            top={5}
                            right={7}
                            height={"60px"}
                            width={"60px"}
                            rounded={30}
                            onClick={handleCreateEntry}
                        >
                            <FaPlus size={25}/>
                        </Button>
                    )}
                </>
            ) : null}
        </Flex>
    )
}

export default Kitchen;