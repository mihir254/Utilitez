import { IngredientType } from "@/src/interfaces/ingredient";
import { Button, Flex, Menu, MenuButton, MenuDivider, MenuItem, MenuItemOption, MenuList, MenuOptionGroup, Text } from "@chakra-ui/react";

type Proptype = {
    ingredients: IngredientType[];
    filterForm: { ingredients: IngredientType[] };
    handleOptionChange: (selectedValues: string | string[]) => void;
    handleSaveFilter: () => void;
    handleClearFilter: () => void;
}

const FilterForm = (props: Proptype) => {
    return (
        <Flex bgColor={"black"} color={"white"} p={5} rounded={25} justifyContent={"center"} alignItems={"center"} direction={"column"}>
            <Flex justifyContent={"center"} alignItems={"center"}>
                <Text color="whiteAlpha.800" fontSize={16}>Ingredients: </Text>
                <Menu colorScheme="blackAlpha.600" closeOnSelect={false} closeOnBlur={true}>
                    <MenuButton as={Button} variant="outlined">
                        Select Ingredients
                    </MenuButton>
                    <MenuList minWidth="200px" maxHeight={"200px"} overflowY={"scroll"}>
                        <MenuOptionGroup type='checkbox' defaultValue={props.filterForm.ingredients.map((ingredient: IngredientType) => ingredient.name)} onChange={props.handleOptionChange}>
                            {props.ingredients.map((ingredient: IngredientType) => (
                                <MenuItemOption borderBottom={"1px solid silver"} key={ingredient._id} value={ingredient._id} color={"black"}>
                                    <Flex>{ingredient.name}</Flex>
                                </MenuItemOption>
                            ))}
                        </MenuOptionGroup>
                    </MenuList>
                </Menu>
            </Flex>
            <Flex justifyContent={"space-evenly"} width={"80%"}>
                <Button mt={8} onClick={props.handleClearFilter}>
                    <Text>Clear</Text>
                </Button>
                <Button mt={8} onClick={props.handleSaveFilter}>
                    <Text>Apply</Text>
                </Button>
            </Flex>
        </Flex>
    )
}

export default FilterForm;