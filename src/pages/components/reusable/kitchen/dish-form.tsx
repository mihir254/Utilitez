import { IngredientType } from "@/src/interfaces/ingredient";
import { Button, Flex, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Radio, RadioGroup, Stack, Text } from "@chakra-ui/react";
import { MdOutlineDone } from "react-icons/md";
import { DishType } from "@/src/interfaces/dish";
import { ChangeEvent, Dispatch, SetStateAction } from "react";

type Proptype = {
    initialDishForm: DishType,
    dishForm: DishType,
    handleSaveDish: () => Promise<void>,
    updateInput: (event: ChangeEvent<HTMLInputElement>) => void,
    updateRadio: (selectedOption: "" | "Lunch" | "Breakfast" | "Dinner") => void,
    handleOptionChange: (selectedValues: string | string[]) => void,
    ingredients: IngredientType[],
    setOpenModal: Dispatch<SetStateAction<boolean>>,
}

const DishFormComponent = (props: Proptype) => {
    return (
        <Flex maxWidth={"400px"} direction={"column"} color={"white"} position={"relative"} m={5} rounded={15} p={5} backgroundColor={"blackAlpha.600"} alignItems={"flex-start"} justifyContent={"center"} style={{boxShadow: "5px 5px 8px rgba(200, 200, 200, 0.5"}}>
            <Button disabled={props.initialDishForm === props.dishForm} bgColor={"white"} position={"absolute"} right={5} top={5} height={"50px"} width={"50px"} rounded={25}>
                <MdOutlineDone size={20} onClick={props.handleSaveDish}/>
            </Button>
            <Flex width={"80%"} alignItems={"center"}>
                <Text width={"100px"} color="whiteAlpha.800" fontSize={16}>Name: </Text> 
                <Input autoFocus fontWeight={"700"} variant={"flushed"} name="name" value={props.dishForm.name} onChange={props.updateInput}/>
            </Flex>
            <Flex alignItems={"center"}>
                <Text width={"100px"} color="whiteAlpha.800" fontSize={16}>Cuisine: </Text> 
                <Input fontWeight={"700"} variant={"flushed"} name="cuisine" value={props.dishForm.cuisine} onChange={props.updateInput}/>
            </Flex>
            <Flex alignItems={"center"}>
                <Text width={"100px"} color="whiteAlpha.800" fontSize={16}>Nutrition: </Text> 
                <Input fontWeight={"700"} variant={"flushed"} name="nutrition" value={props.dishForm.nutrition} onChange={props.updateInput}/>
            </Flex>
            <Flex alignItems={"center"}>
                <Text width={"100px"} color="whiteAlpha.800" fontSize={16}>Preferred Meal: </Text> 
                <RadioGroup onChange={props.updateRadio} value={props.dishForm.preferredMeal} colorScheme="">
                    <Stack direction='row'>
                        <Radio value='Breakfast'>Breakfast</Radio>
                        <Radio value='Lunch'>Lunch</Radio>
                        <Radio value='Dinner'>Dinner</Radio>
                    </Stack>
                </RadioGroup>
            </Flex>
            <Flex alignItems={"center"} width={"100%"}>
                <Text color="whiteAlpha.800" fontSize={16}>Ingredients: </Text>
                <Menu colorScheme="blackAlpha.600" closeOnSelect={false} closeOnBlur={true}>
                    <MenuButton as={Button} variant="outlined">
                        Select Ingredients
                    </MenuButton>
                    <MenuList minWidth="200px" maxHeight={"200px"} overflowY={"scroll"}>
                        <MenuItem color={"black"} onClick={() => props.setOpenModal(true)}>Add Ingredient</MenuItem>
                        <MenuDivider />
                        <MenuOptionGroup type='checkbox' defaultValue={props.dishForm.ingredients.map((ingredient: IngredientType) => ingredient.name)} onChange={props.handleOptionChange}>
                            {props.ingredients.map((ingredient: IngredientType) => (
                                <MenuItemOption borderBottom={"1px solid silver"} key={ingredient.id} value={ingredient._id} color={"black"}>
                                    <Flex>{ingredient.name}</Flex>
                                </MenuItemOption>
                            ))}
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
            </Flex>
        </Flex>
    )
}

export default DishFormComponent;