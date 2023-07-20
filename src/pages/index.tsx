import { useState } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import StringManipulation from './components/string-manipulation';
import LeetCode from './components/leetcode';
import Kitchen from './components/kitchen';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IngredientType } from '../interfaces/ingredient';
import { DishType } from '../interfaces/dish';

type propType = {
  	allIngredients: IngredientType[],
	allDishes: DishType[],
}

const Home = (props: propType) => {
  const [activeComponent, setActiveComponent] = useState <string> ('Kitchen');

  return (
    <Flex direction={"column"} minHeight={"100vh"} backgroundColor={"blackAlpha.900"}>
      <Flex userSelect={"none"} height={"145px"} boxShadow={"2xl"} alignItems={"center"} justifyContent={"space-between"} p={10} backgroundColor={"blackAlpha.700"}>
        <Heading color={"whiteAlpha.800"}>Utility Software</Heading>
        <Flex justifyContent={"flex-end"}>
          <Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("Kitchen")} color={activeComponent==="Kitchen" ? "whiteAlpha.800" : "whiteAlpha.500"}>Kitchen</Heading>
          <Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("String Manipulation")} color={activeComponent==="String Manipulation" ? "whiteAlpha.800" : "whiteAlpha.500"}>String Manipulation</Heading>
          <Heading ml={10} mr={10} size={"lg"} cursor={"pointer"} onClick={() => setActiveComponent("LeetCode")} color={activeComponent==="LeetCode" ? "whiteAlpha.800" : "whiteAlpha.500"}>LeetCode</Heading>
        </Flex>
      </Flex>
      {activeComponent === "Kitchen" && <Kitchen ingredients={props.allIngredients} dishes={props.allDishes}/>}
      {activeComponent === "String Manipulation" && <StringManipulation />}
      {activeComponent === "LeetCode" && <LeetCode />}
    </Flex>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
	let ingredients = await fetch("https://utilitez-8eu5.vercel.app/api/ingredients", {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		},
	});
	let dishes = await fetch("https://utilitez-8eu5.vercel.app/api/dishes", {
		method: "GET",
		headers: {
		"Content-Type": "application/json",
		},
	});

	let ingredientData = await ingredients.json();
	const allIngredients = ingredientData.data;

	let dishData = await dishes.json();
	const allDishes = dishData.data;
	
	return {
		props: {
			allIngredients,
			allDishes,
		}
	}
}