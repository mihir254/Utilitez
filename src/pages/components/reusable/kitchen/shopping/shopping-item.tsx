import { ListItem } from "@/src/interfaces/list-item";
import { Button, Flex, Heading, Text } from "@chakra-ui/react";
import { MdDoneOutline, MdOutlineDelete } from "react-icons/md";

type Proptype = {
    item: ListItem;
    handleRemoveListItem: (item: ListItem) => Promise<void>;
}

const ShoppingItemComponent = (props: Proptype) => {
    return (
        props.item && <Flex m={5} roundedTopLeft={25} roundedBottomRight={25} shadow={"2xl"} backgroundColor={"blackAlpha.500"}
            justifyContent={"space-between"} alignItems={"center"} width={"300px"} color={"whiteAlpha.800"} height={"65px"}>
            <Button display={"flex"} variant={"unstyled"} _hover={{ transform: "scale(1.05)" }} width={"60px"}
                bgColor={"black"} height={"100%"} roundedTopLeft={25} justifyContent={"center"} alignItems={"center"}
                onClick={() => props.handleRemoveListItem(props.item)}>
                <MdDoneOutline size={25} color="white"/>
            </Button>
            <Heading size={"md"} m={5}>{props.item.itemName}</Heading>
            <Button display={"flex"} variant={"unstyled"} _hover={{ transform: "scale(1.05)" }} width={"60px"}
                bgColor={"black"} height={"100%"} roundedBottomRight={25} justifyContent={"center"} alignItems={"center"}
                onClick={() => props.handleRemoveListItem(props.item)}>
                <MdOutlineDelete size={25} color="white"/>
            </Button>
        </Flex>
    )
}

export default ShoppingItemComponent;