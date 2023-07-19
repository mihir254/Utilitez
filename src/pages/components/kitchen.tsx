import { Box, Button, Flex, Heading, ModalOverlay, Modal, ModalContent, ModalCloseButton } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react";
import { IngredientType } from "@/src/interfaces/ingredient";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { BiDish, BiSolidDish } from "react-icons/bi";
import IngredientComponent from "./reusable/kitchen/ingredient";
import { DishType } from "@/src/interfaces/dish";
import DishComponent from "./reusable/kitchen/dish";
import IngredientFormComponent from "./reusable/kitchen/ingredient-form";
import DishFormComponent from "./reusable/kitchen/dish-form";
import {BiLike, BiDislike} from "react-icons/bi";
import ShoppingListItemComponent from "./reusable/kitchen/shopping-list-item";
import { VscClearAll } from "react-icons/vsc";

const initialIngredientForm: IngredientType = {
    _id : '',
    name: '',
    details: '',
    nutrition: '',
    category: '',
    shoppingList: false,
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
    
    const [dishes, setDishes] = useState <DishType[]> (props.dishes);
    const [dishForm, setDishForm] = useState <DishType> (initialDishForm);

    const [shoppingList, setShoppingList] = useState <IngredientType[]> ([]);

    const [openIngredientModal, setOpenIngredientModal] = useState <boolean> (false);
    const [suggestedDish, setSuggestedDish] = useState <DishType | null> (null);
    const [createEntry, setCreateEntry] = useState <boolean> (false);    

    const updateInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (activeComponent === 'Dishes' && !openIngredientModal) {
            setDishForm(prev => {
                return {
                    ...prev,
                    [event.target.name]: event.target.value    
                }
            })
        } else if (activeComponent === 'Ingredients' || openIngredientModal) {
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
        if (openIngredientModal) {
            setOpenIngredientModal(false);
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

    const handleBackButton = () => {
        setActiveComponent('');
        setCreateEntry(false);
        setDishForm(initialDishForm);
        setIngredientForm(initialIngredientForm);
    }

    const handleSelectRandomDish = () => {
        const randomDish = dishes[Math.floor(Math.random()*dishes.length)];
        setSuggestedDish(randomDish);
    }

    const handleSelectTimedRandomDish = () => {
        const currentTime = new Date();
        const hour = currentTime.getHours();
        let timedMenu: Array<DishType> = []
        if (6 <= hour && hour <= 11) {
            timedMenu = dishes.filter((dish: DishType) => dish.preferredMeal === "Breakfast");
        } else if (12 <= hour && hour <= 16) {
            timedMenu = dishes.filter((dish: DishType) => dish.preferredMeal === "Lunch");
        } else if (17 <= hour && hour <= 23) {
            timedMenu = dishes.filter((dish: DishType) => dish.preferredMeal === "Dinner");
        } else {
            console.log("Bad time to eat!")
        }
        const randomDish = timedMenu[Math.floor(Math.random()*timedMenu.length)];
        setSuggestedDish(randomDish);
    }

    const addToShoppingList = async (item: IngredientType) => {
        let res = await fetch(`/api/ingredients/${item._id}`, {
            method: "PUT",
            body: JSON.stringify({...item, shoppingList: true})
        });
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            setIngredients(previousIngredients => {
                const upgradedIngredients = previousIngredients.map((ingredient: IngredientType) => {
                    if (ingredient._id === item._id) {
                        return {...item, shoppingList: true}
                    } else {
                        return ingredient
                    }
                });
                return upgradedIngredients;
            });
            setShoppingList(previousList => [...previousList, {...item, shoppingList: true}]);
        }
    }

    const removeFromShoppingList = async (item: IngredientType) => {
        let res = await fetch(`/api/ingredients/${item._id}`, {
            method: "PUT",
            body: JSON.stringify({...item, shoppingList: false})
        });
        if (res.ok) {
            const data = await res.json();
            console.log(data);
            setIngredients(previousIngredients => {
                const upgradedIngredients = previousIngredients.map((ingredient: IngredientType) => {
                    if (ingredient._id === item._id) {
                        return {...item, shoppingList: false}
                    } else {
                        return ingredient
                    }
                });
                return upgradedIngredients;
            });
            setShoppingList(previousList => previousList.filter((listItem: IngredientType) => listItem._id !== item._id));
        }
    }

    const handleClearShoppingList = () => {
        setShoppingList([]);
    }

    return (
        <Flex pl={2} pr={2} height="calc(100vh - 150px)" position={"relative"}>
            {openIngredientModal ? (
                <Modal closeOnOverlayClick={false} blockScrollOnMount={false} isOpen={openIngredientModal} onClose={() => setOpenIngredientModal(false)} isCentered>
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
                        openIngredientModal={openIngredientModal}
                    />
                    <ModalCloseButton left={7} top={7} size={"md"} color={"white"}/>
                </ModalContent>
            </Modal>
            ) : null}
            {suggestedDish !== null ? (
                <Modal closeOnOverlayClick={false} blockScrollOnMount={false} isOpen={suggestedDish !== null} onClose={() => setSuggestedDish(null)} isCentered>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(13px) hue-rotate(90deg)'
                />
                <ModalContent background={"transparent"}>
                    <Flex color={"white"} bgColor={"black"} rounded={15} justifyContent={"center"} pt={10} pb={10}>
                        <Flex alignItems={"center"} direction={"column"}>
                            <Heading mb={5} size={"lg"} color={"whiteAlpha.700"}>SUGGESTED DISH</Heading>
                            <Heading mb={5}>{suggestedDish.name}</Heading>
                            <BiLike cursor={"pointer"} size={25} style={{ position:"absolute", right: "40px", bottom: "10px" }}/>
                            <BiDislike cursor={"pointer"} size={25} style={{ position:"absolute", right: "10px", bottom: "10px" }}/>
                        </Flex>
                    </Flex>
                    <ModalCloseButton left={3} top={3} size={"md"} color={"white"}/>
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
                        <Button onClick={() => setActiveComponent("Shopping List")} cursor={"pointer"} _hover={{ transform: "scale(1.02)" }} bgColor={"whiteAlpha.800"} rounded={20} width={"300px"} height={"300px"} justifyContent={"center"} alignItems={"center"} shadow={"xl"}>
                            <Heading size={"lg"}>SHOPPING LIST</Heading>
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
                                    openIngredientModal={openIngredientModal}
                                />
                            ) : null}
                            {ingredients && ingredients.map((item, index) => (
                                <IngredientComponent setIngredients={setIngredients} item={item} key={index} addToShoppingList={addToShoppingList} removeFromShoppingList={removeFromShoppingList}/>
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
                                    setOpenIngredientModal={setOpenIngredientModal}
                                />
                            ) : null}
                            {dishes && dishes.map((item, index) => (
                                <DishComponent setDishes={setDishes} item={item} key={index}/>
                            ))}
                        </Flex>
                    </Box>
                ) : activeComponent === "Shopping List" ? (
                    <Box maxHeight={"calc(100vh - 150px)"} minWidth={"100%"} overflowY={"scroll"} pl={20} pr={20}>
                        <Flex wrap="wrap" justifyContent={"center"}>
                            {shoppingList && shoppingList.map((item, index) => (
                                <ShoppingListItemComponent item={item} key={index}/>
                            ))}
                        </Flex>
                    </Box>
                ) : null}
            {activeComponent !== '' ? (
                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"20px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleBackButton}>
                    <FaArrowLeftLong size={25}/>
                </Button>
            ) : null}
            {activeComponent === 'Dishes' ? (
                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"100px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleSelectRandomDish}>
                    <BiDish size={30}/>
                </Button>
            ) : null}
            {activeComponent === 'Dishes' ? (
                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"180px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleSelectTimedRandomDish}>
                    <BiSolidDish size={30}/>
                </Button>
            ) : null}
            {activeComponent === 'Shopping List' ? (
                <Button isDisabled={shoppingList.length === 0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"100px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleClearShoppingList}>
                    <VscClearAll size={30}/>
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