import { Box, Button, Flex, Heading, ModalOverlay, Modal, ModalContent, ModalCloseButton } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react";
import { IngredientType } from "@/src/interfaces/ingredient";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import IngredientComponent from "./reusable/kitchen/ingredient";
import { DishType } from "@/src/interfaces/dish";
import DishComponent from "./reusable/kitchen/dish";
import IngredientFormComponent from "./reusable/kitchen/ingredient-form";
import DishFormComponent from "./reusable/kitchen/dish-form";

const initialIngredientForm: IngredientType = {
    _id : '',
    name: '',
    details: '',
    nutrition: '',
    category: '',
}

const initialDishForm: DishType = {
    _id: '',
    name: '',
    cuisine: '',
    nutrition: '',
    preferredMeal: '',
    ingredients: [],
}

type propType = {
    ingredients: IngredientType[],
    dishes: DishType[],
}

const Kitchen = (props: propType) => {
    const [activeComponent, setActiveComponent] = useState <string> ('');
    const [ingredients, setIngredients] = useState <IngredientType[]> (props.ingredients);
    const [ingredientForm, setIngredientForm] = useState <IngredientType> (initialIngredientForm);

    const [openModal, setOpenModal] = useState <boolean> (false);

    const [dishes, setDishes] = useState <DishType[]> (props.dishes);
    const [dishForm, setDishForm] = useState <DishType> (initialDishForm);

    const [createEntry, setCreateEntry] = useState <boolean> (false);
    

    const updateInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (activeComponent === 'Dishes' && !openModal) {
            setDishForm(prev => {
                return {
                    ...prev,
                    [event.target.name]: event.target.value    
                }
            })
        } else if (activeComponent === 'Ingredients' || openModal) {
            setIngredientForm(prev => {
                return {
                    ...prev,
                    [event.target.name]: event.target.value    
                }
            });
        }
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
        setIngredientForm(initialIngredientForm);
        if (openModal) {
            setOpenModal(false);
        } else {
            setCreateEntry(false);
        }
    }

    const handleCancelIngredient = () => {
        setIngredientForm(initialIngredientForm);
        setCreateEntry(false);
    }

    const handleCreateEntry = () => {
        setCreateEntry(true);
    }

    const handleOptionChange = (selectedValues: string | string[]) => {
        if (Array.isArray(selectedValues)) {
            const ingredientMap: { [key: string]: IngredientType } = {};
                ingredients.forEach((ingredient) => {
                ingredientMap[ingredient._id] = ingredient;
            });
        
            const newSelectedIngredients: IngredientType[] = selectedValues.map(
                (val: string) => ingredientMap[val]
            );
            
            setDishForm((prev) => ({
                ...prev,
                ingredients: newSelectedIngredients,
            }));
        }
    }; 

    const updateRadio = (selectedOption: "" | "Lunch" | "Breakfast" | "Dinner") => {
        setDishForm(prev => {
            return {
                ...prev,
                preferredMeal: selectedOption    
            }
        })
    }

    const handleSaveDish = async () => {
        let res = await fetch("/api/dishes", {
            method: "POST",
            body: JSON.stringify(dishForm)
        });
        if (res.ok) {
            const data = await res.json();
            setDishForm(prev => prev._id = data.message.insertedId);
            setDishes(prev => [dishForm, ...prev]);
        }
        setCreateEntry(false);
        setDishForm(initialDishForm);
    }

    return (
        <Flex pl={2} pr={2} height="calc(100vh - 150px)" position={"relative"}>
            {openModal ? (
                <Modal closeOnOverlayClick={false} blockScrollOnMount={false} isOpen={openModal} onClose={() => setOpenModal(false)} isCentered>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(13px) hue-rotate(90deg)'
                />
                <ModalContent background={"transparent"}>
                    <IngredientFormComponent
                        initialIngredientForm={initialIngredientForm}
                        ingredientForm={ingredientForm}
                        handleSaveIngredient={handleSaveIngredient}
                        updateInput={updateInput}
                        openModal={openModal}
                    />
                    <ModalCloseButton left={7} top={7} size={"md"} color={"white"}/>
                </ModalContent>
            </Modal>
            ) : null}
            {activeComponent === '' ? (
                    <Flex flex={1} justifyContent={"space-evenly"} alignItems={"center"}>
                        <Button onClick={() => setActiveComponent("Ingredients")} cursor={"pointer"} _hover={{ transform: "scale(1.02)" }} bgColor={"whiteAlpha.800"} rounded={20} width={"300px"} height={"300px"} justifyContent={"center"} alignItems={"center"} shadow={"xl"}>
                            <Heading size={"lg"}>INGREDIENTS</Heading>
                        </Button>
                        <Button onClick={() => setActiveComponent("Dishes")} cursor={"pointer"} _hover={{ transform: "scale(1.02)" }} bgColor={"whiteAlpha.800"} rounded={20} width={"300px"} height={"300px"} justifyContent={"center"} alignItems={"center"} shadow={"xl"}>
                            <Heading size={"lg"}>DISHES</Heading>
                        </Button>
                    </Flex>
                ) : activeComponent === 'Ingredients' ? (
                    <Box maxHeight={"calc(100vh - 150px)"} minWidth={"100%"} overflowY={"scroll"} pl={20} pr={20}>
                        <Flex wrap="wrap" justifyContent={"center"}>
                            {createEntry ? (
                                <IngredientFormComponent
                                    initialIngredientForm={initialIngredientForm}
                                    ingredientForm={ingredientForm}
                                    handleSaveIngredient={handleSaveIngredient}
                                    updateInput={updateInput}
                                    openModal={openModal}
                                />
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
                                <DishFormComponent
                                    initialDishForm={initialDishForm}
                                    dishForm={dishForm}
                                    handleSaveDish={handleSaveDish}
                                    updateInput={updateInput}
                                    updateRadio={updateRadio}
                                    handleOptionChange={handleOptionChange}
                                    ingredients={ingredients}
                                    setOpenModal={setOpenModal}
                                />
                            ) : null}
                            {dishes && dishes.map((item, index) => (
                                <DishComponent setDishes={setDishes} item={item} key={index}/>
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