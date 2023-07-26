import { IngredientType } from "@/src/interfaces/ingredient"
import { Flex, Button, Input, Text } from "@chakra-ui/react"
import { ChangeEvent } from "react"
import { MdOutlineDone } from "react-icons/md"

type Proptype = {
    initialIngredientForm: IngredientType,
    ingredientForm: IngredientType,
    handleSaveIngredient: () => Promise<void>,
    updateInput: (event: ChangeEvent<HTMLInputElement>) => void,
    openIngredientModal: boolean,
}

const IngredientFormComponent = (props: Proptype) => {
    return (
        props.ingredientForm && <Flex m={5} rounded={15} p={5} backgroundColor={props.openIngredientModal ? "black" : "blackAlpha.600"} justifyContent={"center"} alignItems={"center"} style={props.openIngredientModal ? {} : {boxShadow: "5px 5px 8px rgba(200, 200, 200, 0.5"}}>
            <Flex color={"white"} width={"300px"} direction={"column"} p={props.openIngredientModal ? 5 : 0} pr={2} position={"relative"}>
                <Button onClick={props.handleSaveIngredient} isDisabled={props.initialIngredientForm === props.ingredientForm} bgColor={"white"} position={"absolute"} right={props.openIngredientModal ? {sm: -10, base: 0} : 0} top={props.openIngredientModal ? -2 : 0} height={"50px"} width={"50px"} rounded={25}>
                    <MdOutlineDone size={20}/>
                </Button>
                <Flex direction={"column"}>
                    <Flex alignItems={"center"}>
                        <Text width={"72px"} color="whiteAlpha.800" fontSize={16}>Name: </Text>
                        <Input autoFocus fontWeight={"700"} ml={3} width={"150px"} variant={"flushed"} color="white" name='name' value={props.ingredientForm.name} onChange={props.updateInput} />
                    </Flex>
                    <Flex alignItems={"center"}>
                        <Text width={"100px"} color="whiteAlpha.800" fontSize={16}>Category: </Text>
                        <Input ml={3} variant={"flushed"} color="white" name='category' value={props.ingredientForm.category} onChange={props.updateInput} />
                    </Flex>
                    <Flex alignItems={"center"}>
                        <Text width={"100px"} color="whiteAlpha.800" fontSize={16}>Nutrition: </Text>
                        <Input ml={3} variant={"flushed"} color="white" name='nutrition' value={props.ingredientForm.nutrition} onChange={props.updateInput} />
                    </Flex>
                    <Flex alignItems={"center"}>
                        <Text width={"100px"} color="whiteAlpha.800" fontSize={16}>Details: </Text>
                        <Input ml={3} variant={"flushed"} color="white" name='details' value={props.ingredientForm.details} onChange={props.updateInput} p={0}/>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    )
}

export default IngredientFormComponent;