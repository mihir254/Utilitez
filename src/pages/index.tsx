import { useState } from 'react';
import { Flex, Heading, Show } from '@chakra-ui/react';
import StringManipulation from './components/string-manipulation';
import LeetCode from './components/leetcode';
import Kitchen from './components/kitchen';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IngredientType } from '../interfaces/ingredient';
import { DishType } from '../interfaces/dish';
import { ListItem } from '../interfaces/list-item';
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import UtilityHome from './components/home';

type propType = {
  	allIngredients: IngredientType[],
	allDishes: DishType[],
	allListItems: ListItem[],
}

const Home = (props: propType) => {
  const [activeComponent, setActiveComponent] = useState <string> ('Kitchen');
  const [openNav, setOpenNav] = useState <boolean> (false);

  return (
    props.allDishes && props.allIngredients ? <Flex direction={"column"} minHeight={"100vh"} backgroundColor={"blackAlpha.900"}>
      <Show above='md'>
		<Flex userSelect={"none"} height={"145px"} boxShadow={"2xl"} alignItems={"center"} justifyContent={"space-between"} p={10} backgroundColor={"blackAlpha.700"}>
			<Heading color={"whiteAlpha.800"}
			// bgColor={{lg: "blue", md: "green", sm: "pink", base: "purple"}}
			 onClick={() => setActiveComponent("Home")} cursor={"pointer"}>Utiliti-ez</Heading>
			<Flex justifyContent={"flex-end"}>
			<Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("Kitchen")} color={activeComponent==="Kitchen" ? "whiteAlpha.800" : "whiteAlpha.500"}>Kitchen</Heading>
			<Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("String Manipulation")} color={activeComponent==="String Manipulation" ? "whiteAlpha.800" : "whiteAlpha.500"}>String Manipulation</Heading>
			{/* <Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("LeetCode")} color={activeComponent==="LeetCode" ? "whiteAlpha.800" : "whiteAlpha.500"}>LeetCode</Heading> */}
			</Flex>
		</Flex>
	  </Show>
      <Show below='md'>
		<Flex zIndex={5} userSelect={"none"} height={"95px"} boxShadow={"2xl"} alignItems={"center"} justifyContent={"space-between"} p={10} backgroundColor={"blackAlpha.900"}>
			<Flex zIndex={10}>{!openNav ? <AiOutlineMenu size={30} color='white' onClick={() => setOpenNav(true)}/> : <AiOutlineClose  size={30} color='white' onClick={() => setOpenNav(false)}/>}</Flex>
			<Heading color={"whiteAlpha.800"} textAlign={"right"} size={{md: "xl", base: "lg"}}>{activeComponent}</Heading>
			{openNav ? <Flex direction={"column"} justifyContent={"center"} alignItems={"center"} position={"absolute"} top={0} bottom={0} left={0} right={0} w="full" h="100vh"
				bgColor={"black"} textAlign={"center"}>
				<Heading p={5} ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => {setActiveComponent("Kitchen"); setOpenNav(false)}} color={activeComponent==="Kitchen" ? "whiteAlpha.800" : "whiteAlpha.500"}>Kitchen</Heading>
				<Heading p={5} ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => {setActiveComponent("String Manipulation"); setOpenNav(false)}} color={activeComponent==="String Manipulation" ? "whiteAlpha.800" : "whiteAlpha.500"}>String Manipulation</Heading>
			</Flex> : null}
		</Flex>
	  </Show>
	  {activeComponent === "Home" && <UtilityHome />}
      {activeComponent === "Kitchen" && <Kitchen ingredients={props.allIngredients} dishes={props.allDishes} shoppingList={props.allListItems}/>}
      {activeComponent === "String Manipulation" && <StringManipulation />}
      {activeComponent === "LeetCode" && <LeetCode />}
    </Flex> : <Flex><Heading>Something Went Wrong</Heading></Flex>
  )
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
	try {
		const server = process.env.SERVER;
		let ingredients = await fetch(`${server}/api/ingredients`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		let dishes = await fetch(`${server}/api/dishes`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});
		let listItems = await fetch(`${server}/api/shopping-list`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		let ingredientData = await ingredients.json();
		const incompleteIngredients = ingredientData.data;

		const allIngredients = incompleteIngredients.map((ingredient: IngredientType) => ({
			...ingredient,
			isSelected: false,
		  }));

		let dishData = await dishes.json();
		const allDishes = dishData.data;

		let listItemData = await listItems.json();
		const allListItems = listItemData.data;
		
		return {
			props: {
				allIngredients,
				allDishes,
				allListItems,
			}
		}
	} catch (error) {
		console.log("Something went wrong in getServerProps: ", error);
		return {
			props: {
			}
		}
	}
}