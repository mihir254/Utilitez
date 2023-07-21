import { useState } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import StringManipulation from './components/string-manipulation';
import LeetCode from './components/leetcode';
import Kitchen from './components/kitchen';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IngredientType } from '../interfaces/ingredient';
import { DishType } from '../interfaces/dish';
import { ListItem } from '../interfaces/list-item';

type propType = {
  	allIngredients: IngredientType[],
	allDishes: DishType[],
	allListItems: ListItem[],
}

const Home = (props: propType) => {
  const [activeComponent, setActiveComponent] = useState <string> ('Kitchen');

  return (
    props.allDishes && props.allIngredients ? <Flex direction={"column"} minHeight={"100vh"} backgroundColor={"blackAlpha.900"}>
      <Flex userSelect={"none"} height={"145px"} boxShadow={"2xl"} alignItems={"center"} justifyContent={"space-between"} p={10} backgroundColor={"blackAlpha.700"}>
        <Heading color={"whiteAlpha.800"}>Utility Software</Heading>
        <Flex justifyContent={"flex-end"}>
          <Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("Kitchen")} color={activeComponent==="Kitchen" ? "whiteAlpha.800" : "whiteAlpha.500"}>Kitchen</Heading>
          <Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("String Manipulation")} color={activeComponent==="String Manipulation" ? "whiteAlpha.800" : "whiteAlpha.500"}>String Manipulation</Heading>
          {/* <Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("LeetCode")} color={activeComponent==="LeetCode" ? "whiteAlpha.800" : "whiteAlpha.500"}>LeetCode</Heading> */}
        </Flex>
      </Flex>
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