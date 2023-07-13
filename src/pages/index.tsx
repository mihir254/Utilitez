import { useState } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import StringManipulation from './components/string-manipulation';
import LeetCode from './components/leetcode';
import Kitchen from './components/kitchen';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { IngredientType } from '../interfaces/ingredient';

type propType = {
  allIngredients: IngredientType[],
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
      {activeComponent === "Kitchen" && <Kitchen ingredients={props.allIngredients}/>}
      {activeComponent === "String Manipulation" && <StringManipulation />}
      {activeComponent === "LeetCode" && <LeetCode />}
    </Flex>
  );
}

export default Home;

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  let res = await fetch("http://localhost:3001/api/ingredients", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  let responseData = await res.json();
  const allIngredients = responseData.data;
  
  return {
    props: {
      allIngredients,
    }
  }
}