import { Text, Box, Button, Flex, Heading, ModalOverlay, Modal, ModalContent, ModalCloseButton, Tooltip, useDisclosure, AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Hide, Show, IconButton, Toast, useToast, CloseButton } from "@chakra-ui/react"
import { ChangeEvent, useRef, useState } from "react";
import { IngredientType } from "@/src/interfaces/ingredient";
import { FaArrowLeftLong, FaPlus } from "react-icons/fa6";
import { BiDish, BiSolidDish } from "react-icons/bi";
import { MdOutlineSelectAll, MdOutlineDeselect } from 'react-icons/md';
import IngredientComponent from "./reusable/kitchen/ingredient/ingredient";
import { DishType } from "@/src/interfaces/dish";
import DishComponent from "./reusable/kitchen/dish/dish";
import IngredientFormComponent from "./reusable/kitchen/ingredient/ingredient-form";
import DishFormComponent from "./reusable/kitchen/dish/dish-form";
import {BiLike, BiDislike} from "react-icons/bi";
import ShoppingItemComponent from "./reusable/kitchen/shopping/shopping-item";
import { VscClearAll } from "react-icons/vsc";
import ShoppingItemForm from "./reusable/kitchen/shopping/shopping-item-form";
import { ListItem } from "@/src/interfaces/list-item";
import { BsBag } from "react-icons/bs";
import { VscFilter, VscFilterFilled } from "react-icons/vsc";
import FilterForm from "./reusable/kitchen/dish/filter-form";
import { TbBulb, TbBulbFilled } from "react-icons/tb"
import { AiOutlineDelete } from "react-icons/ai";
import { Red_Hat_Display } from "next/font/google";

type propType = {
    ingredients: IngredientType[],
    dishes: DishType[],
    shoppingList: ListItem[],
}

const red_hat_display = Red_Hat_Display({ weight: "800", subsets: ["latin"] });

const Kitchen = (props: propType) => {
    
    const initialIngredientForm: IngredientType = {
        _id : '',
        name: '',
        details: '',
        nutrition: '',
        category: '',
        shoppingList: false,
        isSelected: false,
    }
    
    const initialDishForm: DishType = {
        _id: '',
        name: '',
        cuisine: '',
        nutrition: '',
        preferredMeal: '',
        ingredients: [],
    }

    const initialShoppingItemForm: ListItem = {
        _id: '',
        itemName: '',
    }

    const initialFilterForm: { ingredients: IngredientType[] } = {
        // cuisine: '',
        ingredients: [],
    }

    const toast = useToast();

    const [activeComponent, setActiveComponent] = useState <string> ('');
    
    const [ingredients, setIngredients] = useState <IngredientType[]> (props.ingredients);
    const [ingredientForm, setIngredientForm] = useState <IngredientType> (initialIngredientForm);
    
    const [dishes, setDishes] = useState <DishType[]> (props.dishes);
    const [dishForm, setDishForm] = useState <DishType> (initialDishForm);

    const [shoppingList, setShoppingList] = useState <ListItem[]> (props.shoppingList);
    const [shoppingItemForm, setShoppingItemForm] = useState <ListItem> (initialShoppingItemForm);

    const [selectedIngredients, setSelectedIngredients] = useState <IngredientType[]> ([]);
    const [isSelection, setIsSelection] = useState <boolean> (false);

    const [openFilterModal, setOpenFilterModal] = useState <boolean> (false);
    const [filterForm, setFilterForm] = useState <{ ingredients: IngredientType[] }> (initialFilterForm);

    const [suggestedDish, setSuggestedDish] = useState <DishType | null> (null);
    const [suggestedDishMessage, setSuggestedDishMessage] = useState <string> ('');

    const [openIngredientModal, setOpenIngredientModal] = useState <boolean> (false);
    const [createEntry, setCreateEntry] = useState <boolean> (false);

    const { isOpen, onOpen, onClose } = useDisclosure();
    const cancelRef = useRef(null);

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
        } else if (activeComponent === 'Shopping List') {
            setShoppingItemForm(prev => {
                return {
                    ...prev,
                    [event.target.name]: event.target.value    
                }
            });
        }
    }

    const updateRadio = (selectedOption: "" | "Lunch" | "Breakfast" | "Dinner") => {
        setDishForm(prev => {
            return {
                ...prev,
                preferredMeal: selectedOption    
            }
        })
    }

    const handleCreateEntry = () => {
        setCreateEntry(true);
    }

    const handleBackButton = () => {
        setActiveComponent('');
        setCreateEntry(false);
        setDishForm(initialDishForm);
        setIngredientForm(initialIngredientForm);
        setIsSelection(false);
        handleDeselectButton();
    }

    const handleSaveIngredient = async () => {
        let res = await fetch("/api/ingredients", {
            method: "POST",
            body: JSON.stringify(ingredientForm)
        });
        if (res.ok) {
            const data = await res.json();
            setIngredients(prev => [{ ...ingredientForm, _id:data.message.insertedId }, ...prev]);
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

    const handleOptionChange = (selectedValues: string | string[]) => {
        console.log(selectedValues);
        if (Array.isArray(selectedValues)) {
            const ingredientMap: { [key: string]: IngredientType } = {};
                ingredients.forEach((ingredient) => {
                ingredientMap[ingredient._id] = ingredient;
            });
        
            const newSelectedIngredients: IngredientType[] = selectedValues.map(
                (val: string) => ingredientMap[val]
            );
            
            if (activeComponent === "Dishes" && !openFilterModal) {
                setDishForm((prev) => ({
                    ...prev,
                    ingredients: newSelectedIngredients,
                }));
            } else if (activeComponent === "Dishes" && openFilterModal) {
                setFilterForm((prev) => ({
                    ...prev,
                    ingredients: newSelectedIngredients,
                }));
            }
        }
    };

    const handleSaveDish = async () => {
        let res = await fetch("/api/dishes", {
            method: "POST",
            body: JSON.stringify(dishForm)
        });
        if (res.ok) {
            const data = await res.json();
            setDishes(prev => [{...dishForm, _id:data.message.insertedId}, ...prev]);
        }
        setCreateEntry(false);
        setDishForm(initialDishForm);
    }

    const handleSelectRandomDish = () => {
        const randomDish = dishes[Math.floor(Math.random()*dishes.length)];
        setSuggestedDishMessage("This suggestion selects a dish randomly from all the available dishes");
        setSuggestedDish(randomDish);
    }

    const handleSelectFilteredRandomDish = () => {
        const currentTime = new Date();
        const hour = currentTime.getHours();
        let timedMenu: Array<DishType> = [];
        const parentDishesArray: Array<DishType> = dishes.length > 0 ? dishes : props.dishes;
        if (6 <= hour && hour <= 11) {
            timedMenu = parentDishesArray.filter((dish: DishType) => dish.preferredMeal === "Breakfast");
        } else if (12 <= hour && hour <= 16) {
            timedMenu = parentDishesArray.filter((dish: DishType) => dish.preferredMeal === "Lunch");
        } else if (17 <= hour && hour <= 23) {
            timedMenu = parentDishesArray.filter((dish: DishType) => dish.preferredMeal === "Dinner");
        } else {
            console.log("Bad time to eat!")
        }
        const randomDish = timedMenu[Math.floor(Math.random()*timedMenu.length)];
        if (!randomDish) {
            handleSelectRandomDish();
            return;
        }
        setSuggestedDishMessage("This suggestion takes into consideration the applied filters and what time of the day it is");
        setSuggestedDish(randomDish);
    }

    const addIngredientToShoppingList = async (item: IngredientType) => {
        const ingredientToAdd: ListItem = { _id: item._id, itemName: item.name };
        let shoppingListResult = await fetch("/api/shopping-list", {
            method: "POST",
            body: JSON.stringify(ingredientToAdd)
        });
        if (shoppingListResult.ok) {
            setShoppingList(previousList => [...previousList, ingredientToAdd]);
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
            }
        }
    }
    
    const removeIngredientFromShoppingList = async (item: IngredientType) => {
        let shoppingListResult = await fetch(`/api/shopping-list/${item._id}`, {
            method: "DELETE",
        });
        if (shoppingListResult.ok) {
            setShoppingList(previousList => previousList.filter((listItem: ListItem) => listItem._id !== item._id));
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
                            return {...ingredient, shoppingList: false}
                        } else {
                            return ingredient
                        }
                    });
                    return upgradedIngredients;
                });
            }
        }
    }

    const handleClearShoppingList = async () => {
        let res = await fetch(`/api/shopping-list`, {
            method: "PUT",
        });
        if (res.ok) {
            const data = await res.json();
            console.log(data.message);
            ingredients.forEach((ingredient: IngredientType) => {
                if (ingredient.shoppingList) {
                    ingredient.shoppingList = false;
                }
            })
            setShoppingList([]);
        }
    }

    const handleSaveListItem = async () => {
        let res = await fetch("/api/shopping-list", {
            method: "POST",
            body: JSON.stringify(shoppingItemForm)
        });
        if (res.ok) {
            const data = await res.json();
            setShoppingList(prev => [{...shoppingItemForm, _id:data.message.insertedId}, ...prev]);
        }
        setCreateEntry(false);
        setShoppingItemForm(initialShoppingItemForm);
    }

    const handleRemoveListItem = async (item: ListItem) => {
        let shoppingListResult = await fetch(`/api/shopping-list/${item._id}`, {
            method: "DELETE",
        });
        if (shoppingListResult.ok) {
            setShoppingList(previousList => previousList.filter((listItem: ListItem) => listItem._id !== item._id));
            const ingredientListItem = ingredients.find((ingredient: IngredientType) => ingredient._id === item._id);
            if (ingredientListItem) {
                let res = await fetch(`/api/ingredients/${item._id}`, {
                    method: "PUT",
                    body: JSON.stringify({...ingredientListItem, shoppingList: false})
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    setIngredients(previousIngredients => {
                        const upgradedIngredients = previousIngredients.map((ingredient: IngredientType) => {
                            if (ingredient._id === item._id) {
                                return {...ingredientListItem, shoppingList: false}
                            } else {
                                return ingredient
                            }
                        });
                        return upgradedIngredients;
                    });
                }
            }
            toast({
                title: "Item Deleted",
                description: "The item was deleted successfully",
                status: "success",
                duration: 3000,
                isClosable: true,
                position: "bottom",
                render: ({ onClose }) => (
                    <Flex rounded={20} p={2} pr={5} bgColor={"black"} justifyContent={"space-evenly"} alignItems={"center"}>
                        <CloseButton mr={5} onClick={onClose}/>
                        <Text mr={8} color={"white"}>The item has been deleted</Text>
                        <Button _hover={{ bgColor: "transparent", color: "whiteAlpha.800" }} bgColor={"transparent"} onClick={() => {handleUndoListItemRemove(item); onClose();}} color={"whiteAlpha.600"}>
                            Undo
                        </Button>
                    </Flex>
                )
            });
        }
    }

    const handleUndoListItemRemove = async (item: ListItem) => {
        let res = await fetch("/api/shopping-list", {
            method: "POST",
            body: JSON.stringify(item)
        });
        if (res.ok) {
            const data = await res.json();
            setShoppingList(prev => [{...item, _id:data.message.insertedId}, ...prev]);
            const ingredientListItem = ingredients.find((ingredient: IngredientType) => ingredient._id === item._id);
            if (ingredientListItem) {
                let res = await fetch(`/api/ingredients/${item._id}`, {
                    method: "PUT",
                    body: JSON.stringify({...ingredientListItem, shoppingList: true})
                });
                if (res.ok) {
                    const data = await res.json();
                    console.log(data);
                    setIngredients(previousIngredients => {
                        const upgradedIngredients = previousIngredients.map((ingredient: IngredientType) => {
                            if (ingredient._id === item._id) {
                                return {...ingredientListItem, shoppingList: true}
                            } else {
                                return ingredient
                            }
                        });
                        return upgradedIngredients;
                    });
                }
            }
        }
    }

    const handleIngredientSelection = (item: IngredientType) => {
        if (item.isSelected) {
            setIngredients(previousIngredients => {
                const upgradedIngredients = previousIngredients.map((ingredient: IngredientType) => {
                    if (ingredient._id === item._id) {
                        return {...item, isSelected: false}
                    } else {
                        return ingredient
                    }
                });
                return upgradedIngredients;
            });
            setSelectedIngredients(prev => prev.filter((ingredient: IngredientType) => ingredient._id !== item._id));
        } else {
            setIngredients(previousIngredients => {
                const upgradedIngredients = previousIngredients.map((ingredient: IngredientType) => {
                    if (ingredient._id === item._id) {
                        return {...item, isSelected: true}
                    } else {
                        return ingredient
                    }
                });
                return upgradedIngredients;
            });
            setSelectedIngredients(prev => [...prev, item]);
        }
    }

    const handleDeselectButton = () => {
        setIsSelection(false);
        setSelectedIngredients([]);
        setIngredients(previousIngredients => {
            const upgradedIngredients = previousIngredients.map((ingredient: IngredientType) => {
                return {...ingredient, isSelected: false}
            });
            return upgradedIngredients;
        });
    }

    const handleMultipleIngredientsToList = async () => {
        const ingredientsToAdd: Array<ListItem> = selectedIngredients
            .filter((ingredient: IngredientType) => !ingredient.shoppingList)
            .map((ingredient: IngredientType) => ({ _id: ingredient._id, itemName: ingredient.name }));
        if (ingredientsToAdd.length > 0) {
            let shoppingListResult = await fetch("/api/shopping-list", {
                method: "POST",
                body: JSON.stringify(ingredientsToAdd)
            });
            if (shoppingListResult.ok) {
                setShoppingList(previousList => [...previousList, ...ingredientsToAdd]);
                let res = await fetch(`/api/ingredients`, {
                    method: "PUT",
                    body: JSON.stringify(selectedIngredients)
                });
                if (res.ok) {
                    const data = await res.json();
                    const idsToUpdate = selectedIngredients.map((ingredient: IngredientType) => ingredient._id);
                    setIngredients(previousIngredients => {
                        const upgradedIngredients = previousIngredients.map((ingredient: IngredientType) => {
                            if (idsToUpdate.includes(ingredient._id)) {
                                return {...ingredient, shoppingList: true}
                            } else {
                                return ingredient
                            }
                        });
                        return upgradedIngredients;
                    });
                    setSelectedIngredients([]);
                    setIsSelection(false);
                }
            }
        }
        handleDeselectButton();
    }

    const handleFilter = () => {
        setOpenFilterModal(true);
        setCreateEntry(false);
        setDishForm(initialDishForm);
        setIngredientForm(initialIngredientForm);
    }

    const handleSaveFilter = () => {
        const filteredDishes: Array<DishType> = [];
        props.dishes.forEach((dish: DishType) => {
            let count = 0;
            dish.ingredients.forEach((ingredient: IngredientType) => {
                filterForm.ingredients.forEach((selectedIngredient: IngredientType) => {
                    if (ingredient._id === selectedIngredient._id) {
                        count++;
                    }
                })
            })
            if (count === filterForm.ingredients.length){
                filteredDishes.push(dish);
            }
        });
        setDishes(filteredDishes);
        setOpenFilterModal(false);
    }

    const handleClearFilter = () => {
        setDishes(props.dishes);
        setFilterForm((prev) => ({
            ...prev,
            ingredients: [],
        }));
    }

    const handleMultipleIngredientsDelete = async () => {
        if (selectedIngredients.length > 0) {
            const idsToDelete = selectedIngredients.map((ingredient: IngredientType) => ingredient._id);
            const queryString = idsToDelete.join('&ids=');
            let ingredientsDeleteResult = await fetch(`/api/ingredients?ids=${queryString}`, {
                method: "DELETE"
            });
            if (ingredientsDeleteResult.ok) {
                setIngredients(previousIngredients => {
                    const upgradedIngredients = previousIngredients.filter((ingredient: IngredientType) => {
                        return !idsToDelete.includes(ingredient._id)
                    });
                    return upgradedIngredients;
                });
                setSelectedIngredients([]);
                setIsSelection(false);
            }
        }
    }

    return (
        <Flex pl={2} pr={2} height={{md: "calc(100vh - 150px)", base: "calc(100vh - 100px)"}} position={"relative"} direction={"column"}>
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
            {openFilterModal ? (
                <Modal closeOnOverlayClick={false} blockScrollOnMount={false} isOpen={openFilterModal} onClose={() => setOpenFilterModal(false)} isCentered>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(13px) hue-rotate(90deg)'
                />
                <ModalContent background={"transparent"}>
                    <FilterForm
                        ingredients={ingredients}
                        filterForm={filterForm}
                        handleSaveFilter={handleSaveFilter}
                        handleClearFilter={handleClearFilter}
                        handleOptionChange={handleOptionChange}
                    />
                    <ModalCloseButton size={"md"} color={"white"}/>
                </ModalContent>
            </Modal>
            ) : null}
            {suggestedDish !== null && suggestedDish !== undefined ? (
                <Modal closeOnOverlayClick={false} blockScrollOnMount={false} isOpen={suggestedDish !== null} onClose={() => {setSuggestedDish(null); setSuggestedDishMessage('');}} isCentered>
                <ModalOverlay
                    bg='blackAlpha.300'
                    backdropFilter='blur(13px) hue-rotate(90deg)'
                />
                <ModalContent background={"transparent"}>
                    <Flex color={"white"} bgColor={"black"} rounded={15} justifyContent={"center"} pt={10} pb={10}>
                        <Flex alignItems={"center"} direction={"column"}>
                            <Heading mb={5} size={"lg"} color={"whiteAlpha.700"}>SUGGESTED DISH</Heading>
                            <Heading mb={5}>{suggestedDish.name}</Heading>
                            <BiLike cursor={"pointer"} size={25} style={{ position:"absolute", right: "40px", top: "10px" }}/>
                            <BiDislike cursor={"pointer"} size={25} style={{ position:"absolute", right: "10px", top: "10px" }}/>
                            <Tooltip hasArrow p={5} rounded={10} label={suggestedDishMessage}>
                                <IconButton position="absolute" right= "10px" bottom= "10px" aria-label={""} icon={<TbBulb />} />
                            </Tooltip>
                        </Flex>
                    </Flex>
                    <ModalCloseButton left={3} top={3} size={"md"} color={"white"}/>
                </ModalContent>
            </Modal>
            ) : null}
            {activeComponent !== "" ? 
                <Show breakpoint='(max-width: 530px)'>
                    <Box mt={2} mb={2} display={"flex"} flexDirection={"row"} justifyContent={"space-between"} shadow={"xl"}>
                        {activeComponent !== '' ? (
                            <Tooltip label="Menu">
                                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} height={"60px"} width={"60px"} rounded={30} onClick={handleBackButton}>
                                    <FaArrowLeftLong size={25}/>
                                </Button>
                            </Tooltip>
                        ) : null}
                        {activeComponent === 'Ingredients' ? !isSelection ? (
                            <Tooltip label="Select Multiple">
                                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} height={"60px"} width={"60px"} rounded={30} onClick={() => setIsSelection(true)}>
                                    <MdOutlineSelectAll size={30}/>
                                </Button>
                            </Tooltip>
                        ) : (
                            <>
                                <Tooltip label="End Selection">
                                    <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} height={"60px"} width={"60px"} rounded={30} onClick={handleDeselectButton}>
                                        <MdOutlineDeselect size={30}/>
                                    </Button>
                                </Tooltip>
                                <Tooltip label="Add to Shopping List">
                                    <Button isDisabled={selectedIngredients.length===0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"}height={"60px"} width={"60px"} rounded={30} onClick={handleMultipleIngredientsToList}>
                                        <BsBag size={30}/>
                                    </Button>
                                </Tooltip>
                            </>
                        ) : null}
                        {activeComponent === 'Dishes' ? (
                            <Tooltip label="Filter">
                                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} height={"60px"} width={"60px"} rounded={30} onClick={handleFilter}>
                                    {props.dishes.length === dishes.length ? <VscFilter size={30}/> : <VscFilterFilled size={30}/>}
                                </Button>
                            </Tooltip>
                        ) : null}
                        {activeComponent === 'Dishes' ? (
                            <Tooltip label="Random Dish">
                                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} height={"60px"} width={"60px"} rounded={30} onClick={handleSelectRandomDish}>
                                    <BiDish size={30}/>
                                </Button>
                            </Tooltip>
                        ) : null}
                        {activeComponent === 'Dishes' ? (
                            <Tooltip label="Filtered Random Dish">
                                <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} height={"60px"} width={"60px"} rounded={30} onClick={handleSelectFilteredRandomDish}>
                                    <BiSolidDish size={30}/>
                                </Button>
                            </Tooltip>
                        ) : null}
                        {activeComponent === 'Shopping List' ? (
                            <Tooltip label="Delete All">
                                <>
                                <Button isDisabled={shoppingList.length === 0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} height={"60px"} width={"60px"} rounded={30} onClick={onOpen}>
                                    <VscClearAll size={30}/>
                                </Button>
                                <AlertDialog
                                    motionPreset='slideInBottom'
                                    leastDestructiveRef={cancelRef}
                                    onClose={onClose}
                                    isOpen={isOpen}
                                    isCentered
                                >
                                    <AlertDialogOverlay />
                                    <AlertDialogContent>
                                    <AlertDialogHeader>Clear Shopping List?</AlertDialogHeader>
                                    <AlertDialogCloseButton />
                                    <AlertDialogBody>
                                        Are you sure you want to discard all of your items from the shopping list?
                                    </AlertDialogBody>
                                    <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={onClose}>
                                        No
                                        </Button>
                                        <Button colorScheme='red' ml={3} onClick={() => {handleClearShoppingList(); onClose();}}>
                                        Yes
                                        </Button>
                                    </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                                </>
                            </Tooltip>
                        ) : null}
                        {activeComponent !== '' ? (
                            <>
                                {createEntry ? (
                                    <Tooltip label="Cancel">
                                        <Button
                                        justifySelf={"flex-end"}
                                            _hover={{ transform: "scale(1.02)" }}
                                            bgColor={"white"}
                                            shadow={"xl"}
                                            height={"60px"}
                                            width={"60px"}
                                            rounded={30}
                                            onClick={handleCancelIngredient}
                                        >
                                            <FaPlus size={25} style={{ transform : "rotate(45deg)" }}/>
                                        </Button>
                                    </Tooltip>
                                    ) : (
                                    <Tooltip label="New" openDelay={300}>
                                        <Button
                                            _hover={{ transform: "scale(1.02)" }}
                                            bgColor={"white"}
                                            shadow={"xl"}
                                            height={"60px"}
                                            width={"60px"}
                                            rounded={30}
                                            onClick={handleCreateEntry}
                                        >
                                            <FaPlus size={25}/>
                                        </Button>
                                    </Tooltip>
                                )}
                            </>
                        ) : null}
                    </Box>
                </Show>
            : null}
            {activeComponent === '' ? (
                    <Flex flex={1} justifyContent={"space-evenly"} alignItems={"center"} direction={{ md: "row", base: "column" }} overflowY={"scroll"}>
                        <Button m={5} onClick={() => setActiveComponent("Ingredients")} cursor={"pointer"} _hover={{ transform: "scale(1.02)" }}
                            bgColor={"whiteAlpha.800"} rounded={20} width={{lg: "300px", md: "230px", base: "180px"}} height={{lg: "300px", md: "230px", base: "180px"}} justifyContent={"center"}
                            alignItems={"center"} shadow={"xl"}>
                            <Heading fontSize={{lg: "32px", md: "22px", base: "18px"}}><p className={red_hat_display.className}>INGREDIENTS</p></Heading>
                        </Button>
                        <Button m={5} onClick={() => setActiveComponent("Dishes")} cursor={"pointer"} _hover={{ transform: "scale(1.02)" }}
                            bgColor={"whiteAlpha.800"} rounded={20} width={{lg: "300px", md: "230px", base: "180px"}} height={{lg: "300px", md: "230px", base: "180px"}} justifyContent={"center"}
                            alignItems={"center"} shadow={"xl"}>
                            <Heading fontSize={{lg: "32px", md: "22px", base: "18px"}}><p className={red_hat_display.className}>DISHES</p></Heading>
                        </Button>
                        <Button m={5} onClick={() => setActiveComponent("Shopping List")} cursor={"pointer"} _hover={{ transform: "scale(1.02)" }}
                            bgColor={"whiteAlpha.800"} rounded={20} width={{lg: "300px", md: "230px", base: "180px"}} height={{lg: "300px", md: "230px", base: "180px"}} justifyContent={"center"}
                            alignItems={"center"} shadow={"xl"}>
                            <Heading fontSize={{lg: "32px", md: "22px", base: "18px"}}><p className={red_hat_display.className}>SHOPPING LIST</p></Heading>
                        </Button>
                    </Flex>
                ) : activeComponent === 'Ingredients' ? (
                    <Box minWidth={"100%"} overflowY={"scroll"} pl={20} pr={20}>
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
                                <IngredientComponent
                                    setIngredients={setIngredients}
                                    item={item}
                                    key={index}
                                    addIngredientToShoppingList={addIngredientToShoppingList}
                                    handleRemoveListItem={handleRemoveListItem}
                                    isSelection={isSelection}
                                    handleIngredientSelection={handleIngredientSelection}
                                />
                            ))}
                        </Flex>
                    </Box>
                ) : activeComponent === "Dishes" ? (
                    <Box minWidth={"100%"} overflowY={"scroll"} pl={20} pr={20}>
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
                    <Box minWidth={"100%"} overflowY={"scroll"} pl={20} pr={20}>
                        <Flex wrap="wrap" justifyContent={"center"}>
                            {createEntry ? (
                                <ShoppingItemForm
                                    shoppingItemForm={shoppingItemForm}
                                    updateInput={updateInput}
                                    handleSaveListItem={handleSaveListItem}
                                />
                            ) : null}
                            {shoppingList && shoppingList.map((item, index) => (
                                <ShoppingItemComponent item={item} key={index} handleRemoveListItem={handleRemoveListItem}/>
                            ))}
                        </Flex>
                    </Box>
                ) : null}
            <Hide breakpoint='(max-width: 530px)'>
                {activeComponent !== '' ? (
                    <Tooltip label="Menu">
                        <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"20px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleBackButton}>
                            <FaArrowLeftLong size={25}/>
                        </Button>
                    </Tooltip>
                ) : null}
                {activeComponent === 'Ingredients' ? !isSelection ? (
                    <Tooltip label="Select Multiple">
                        <Button isDisabled={ingredients.length === 0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"100px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={() => setIsSelection(true)}>
                            <MdOutlineSelectAll size={30}/>
                        </Button>
                    </Tooltip>
                ) : (
                    <>
                        <Tooltip label="End Selection">
                            <Button _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"100px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleDeselectButton}>
                                <MdOutlineDeselect size={30}/>
                            </Button>
                        </Tooltip>
                        <Tooltip label="Add to Shopping List">
                            <Button isDisabled={selectedIngredients.length===0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"180px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleMultipleIngredientsToList}>
                                <BsBag size={30}/>
                            </Button>
                        </Tooltip>
                        <Tooltip label="Delete Selected">
                            <Button isDisabled={selectedIngredients.length===0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"260px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleMultipleIngredientsDelete}>
                                <AiOutlineDelete size={30}/>
                            </Button>
                        </Tooltip>
                    </>
                ) : null}
                {activeComponent === 'Dishes' ? (
                    <Tooltip label="Filter">
                        <Button isDisabled={dishes.length === 0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"100px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleFilter}>
                            <VscFilter size={30}/>
                        </Button>
                    </Tooltip>
                ) : null}
                {activeComponent === 'Dishes' ? (
                    <Tooltip label="Random Dish">
                        <Button isDisabled={dishes.length === 0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"180px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleSelectRandomDish}>
                            <BiDish size={30}/>
                        </Button>
                    </Tooltip>
                ) : null}
                {activeComponent === 'Dishes' ? (
                    <Tooltip label="Filtered Random Dish">
                        <Button isDisabled={dishes.length === 0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"260px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={handleSelectFilteredRandomDish}>
                            <BiSolidDish size={30}/>
                        </Button>
                    </Tooltip>
                ) : null}
                {activeComponent === 'Shopping List' ? (
                    <Tooltip label="Delete All">
                        <>
                        <Button isDisabled={shoppingList.length === 0} _hover={{ transform: "scale(1.02)" }} bgColor={"white"} shadow={"xl"} position={"absolute"} top={"100px"} left={5} height={"60px"} width={"60px"} rounded={30} onClick={onOpen}>
                            <VscClearAll size={30}/>
                        </Button>
                        <AlertDialog
                            motionPreset='slideInBottom'
                            leastDestructiveRef={cancelRef}
                            onClose={onClose}
                            isOpen={isOpen}
                            isCentered
                        >
                            <AlertDialogOverlay />
                            <AlertDialogContent>
                            <AlertDialogHeader>Clear Shopping List?</AlertDialogHeader>
                            <AlertDialogCloseButton />
                            <AlertDialogBody>
                                Are you sure you want to discard all of your items from the shopping list?
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={onClose}>
                                No
                                </Button>
                                <Button colorScheme='red' ml={3} onClick={() => {handleClearShoppingList(); onClose();}}>
                                Yes
                                </Button>
                            </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        </>
                    </Tooltip>
                ) : null}
                {activeComponent !== '' ? (
                    <>
                        {createEntry ? (
                            <Tooltip label="Cancel">
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
                            </Tooltip>
                            ) : (
                            <Tooltip label="New" openDelay={300}>
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
                            </Tooltip>
                        )}
                    </>
                ) : null}
            </Hide>
        </Flex>
    )
}

export default Kitchen;


// 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