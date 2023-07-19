import { IngredientType } from "@/src/interfaces/ingredient";
import { Button, Flex, Heading, Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger, Portal, Text } from "@chakra-ui/react";
import { MdDoneOutline, MdOutlineDelete } from "react-icons/md";

type Proptype = {
    item: IngredientType;
}

const ShoppingListItemComponent = (props: Proptype) => {
    return (
        <Flex m={5} roundedTopLeft={25} roundedBottomRight={25} shadow={"2xl"} backgroundColor={"blackAlpha.500"}
            justifyContent={"space-between"} alignItems={"center"} width={"300px"} color={"whiteAlpha.800"}>
            <Button _hover={{ transform: "scale(1.05)" }} width={"60px"} bgColor={"black"} height={"100%"} roundedTopLeft={25} justifyContent={"center"} alignItems={"center"}>
                <MdDoneOutline size={25} color="white"/>
            </Button>
            <Heading size={"md"} m={5}>{props.item.name}</Heading>
            <Button _hover={{ transform: "scale(1.05)" }} width={"60px"} bgColor={"black"} height={"100%"} roundedBottomRight={25} justifyContent={"center"} alignItems={"center"}>
                <MdOutlineDelete size={25} color="white"/>
            </Button>
        </Flex>
    )
}

export default ShoppingListItemComponent;