import { IngredientType } from "@/src/interfaces/ingredient";
import { Text, Flex, Popover, PopoverTrigger, Button, Portal, PopoverContent, PopoverArrow, PopoverBody, Heading } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";

type IngredientComponentProps = {
    setIngredients: Dispatch<SetStateAction<IngredientType[]>>;
    item: IngredientType;
    addToShoppingList: (item: IngredientType) => void;
    removeFromShoppingList: (item: IngredientType) => void;
};

const IngredientComponent = (props: IngredientComponentProps) => {

    const handleDeleteIngredient = async (item: IngredientType) => {
        let id = item._id;
        console.log(item);
        let res = await fetch(`/api/ingredients/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            props.setIngredients((prev: IngredientType[]) => prev.filter(ingredient => ingredient._id !== id));
        }
        res = await res.json();
        console.log(res)
    }

    return (
        props.item && <Flex _hover={{ transform: "scale(1.01)" }} m={5} rounded={15} shadow={"2xl"} p={5} backgroundColor={"blackAlpha.600"} justifyContent={"center"} alignItems={"center"}>
            <Flex color={"white"} width={"300px"} direction={"column"} p={2} pl={5} position={"relative"}>
                <Popover>
                    <PopoverTrigger>
                            <Button bgColor={"whiteAlpha.700"} position={"absolute"} right={0} top={0} height={"50px"} width={"50px"} rounded={25}>
                                <PiDotsThreeOutlineVerticalFill size={20} />
                            </Button>
                    </PopoverTrigger>
                    <Portal>
                        <PopoverContent width={"200px"} p={0} border={0} rounded={20}>
                            <PopoverArrow bgColor={"whiteAlpha.700"}/>
                            <PopoverBody p={0} display={"flex"} flexDirection={"column"} alignItems={"center"}>
                                <Button width={"100%"} bgColor={"#777"} rounded={0} roundedTop={20}>EDIT</Button>
                                <Button width={"100%"} bgColor={"#888"} rounded={0} onClick={() => handleDeleteIngredient(props.item)}>DELETE</Button>
                                {!props.item.shoppingList ? <Button width={"100%"} bgColor={"#999"} rounded={0} roundedBottom={20} onClick={() => props.addToShoppingList(props.item)}>ADD TO LIST</Button> : 
                                <Button width={"100%"} bgColor={"#999"} rounded={0} roundedBottom={20} onClick={() => props.removeFromShoppingList(props.item)}>REMOVE FROM LIST</Button>}
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
                <Heading size={"md"} p={2} pl={0}>{props.item.name}</Heading>
                <Flex alignItems={"center"}>
                    <Text color={"whiteAlpha.700"} whiteSpace="pre">Category : </Text>
                    <Text fontSize={18}>{props.item.category}</Text>
                </Flex>
                <Flex alignItems={"center"}>
                    <Text color={"whiteAlpha.700"} whiteSpace="pre">Nutrition : </Text>
                    <Text>{props.item.nutrition}</Text>
                </Flex>
                <Flex alignItems={"flex-start"}>
                    <Text color={"whiteAlpha.700"} whiteSpace="pre">Details : </Text>
                    <Text>{props.item.details}</Text>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default IngredientComponent;