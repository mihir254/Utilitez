import { IngredientType } from "@/src/interfaces/ingredient";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { ChangeEvent } from "react";
import { MdOutlineDone } from "react-icons/md";

type Proptype = {
    shoppingItemForm: { itemName: string };
    updateInput: (event: ChangeEvent<HTMLInputElement>) => void,
    handleSaveListItem: () => Promise<void>,
}

const ShoppingItemForm = (props: Proptype) => {
    return (
        <Flex m={5} rounded={15} backgroundColor={"blackAlpha.600"} justifyContent={"space-between"} alignItems={"center"} style={{boxShadow: "5px 5px 8px rgba(200, 200, 200, 0.5"}}
            color={"white"} width={"320px"} height={"65px"} pl={5} pr={5}>
            <Flex alignItems={"center"}>
                <Input autoFocus width={"200px"} fontWeight={"700"} fontSize={20} variant={"flushed"} color="white" name='itemName' value={props.shoppingItemForm.itemName} onChange={props.updateInput} />
            </Flex>
            <Button bgColor={"white"} height={"50px"} width={"50px"} rounded={25}>
                <MdOutlineDone size={20} onClick={props.handleSaveListItem}/>
            </Button>
        </Flex>
    )
}

export default ShoppingItemForm;