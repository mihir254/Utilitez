import { DishType } from "@/src/interfaces/dish";
import { Text, Flex, Popover, PopoverTrigger, Button, Portal, PopoverContent, PopoverArrow, PopoverBody, Heading, Divider, MenuButton, MenuGroup, MenuItem, MenuList } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import React from "react";

type DishComponentProps = {
    setDishes: Dispatch<SetStateAction<DishType[]>>;
    item: DishType;
};

const DishComponent = (props: DishComponentProps) => {

    const handleDeleteDish = async (item: DishType) => {
        let id = item._id;
        let res = await fetch(`/api/dishes/${id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            props.setDishes((prev: DishType[]) => prev.filter(dish => dish._id !== id));
        }
        res = await res.json();
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
                                <Button width={"100%"} bgColor={"#888"} rounded={0} onClick={() => handleDeleteDish(props.item)}>DELETE</Button>
                                <Button width={"100%"} bgColor={"#999"} rounded={0} roundedBottom={20}>RECIPE</Button>
                            </PopoverBody>
                        </PopoverContent>
                    </Portal>
                </Popover>
                <Heading size={"md"} p={2} pl={0}>{props.item.name}</Heading>
                <Flex alignItems={"center"}>
                    <Text color={"whiteAlpha.700"} whiteSpace="pre">Cuisine : </Text>
                    <Text fontSize={18}>{props.item.cuisine}</Text>
                </Flex>
                <Flex alignItems={"center"}>
                    <Text color={"whiteAlpha.700"} whiteSpace="pre">Nutrition : </Text>
                    <Text>{props.item.nutrition}</Text>
                </Flex>
                <Flex alignItems={"center"}>
                    <Text color={"whiteAlpha.700"} whiteSpace="pre">Preferred Meal : </Text>
                    <Text>{props.item.preferredMeal}</Text>
                </Flex>
                <Divider mt={2} borderColor={"whiteAlpha.300"}/>
                <Flex alignItems={"flex-start"}>
                    <Text color={"whiteAlpha.700"} whiteSpace="pre">Ingredients : </Text>
                    <Text>
                        {props.item.ingredients.map((ingredient, index) => (
                            <React.Fragment key={ingredient._id}>
                                {ingredient.name}
                                {index !== props.item.ingredients.length - 1 && ', '}
                            </React.Fragment>
                        ))}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
}

export default DishComponent;