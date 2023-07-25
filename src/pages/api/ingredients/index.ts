import clientPromise from '@/src/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, ObjectId } from "mongodb";
import { IngredientType } from '@/src/interfaces/ingredient';

const getAllIngredients = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const allIngredients = await db?.collection("Ingredients").find({}).toArray();
    res.status(200).json({ message: "Fetched Data Successfully", data: allIngredients });
}

const createIngredient = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const {name, details, nutrition, category} = JSON.parse(req.body);
    let bodyObj = {
        _id: new ObjectId(),
        name,
        details,
        nutrition,
        category,
        shoppingList: false,
    }
    let newIngredient = await db?.collection("Ingredients").insertOne(bodyObj);
    res.status(201).json({ message: newIngredient })
}

const editMultipleIngredients = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const ingredients = JSON.parse(req.body);
    const objectIDs = ingredients.map((ingredient: IngredientType) => new ObjectId(ingredient._id as string));
    const updateResult = await db?.collection("Ingredients").updateMany(
        { _id: { $in: objectIDs } },
        { $set: { shoppingList: true } }
    );
    console.log(updateResult);
    if (updateResult.modifiedCount > 0) {
        res.status(200).json({ message: "Ingredient updated succesfully" });
    } else {
        res.status(404).json({ message: "Ingredient not found" });
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client?.db("KitchenDatabase");
        if (db) {
            if (req.method === 'GET') {
                getAllIngredients(db, req, res);
            } else if (req.method === 'POST') {
                createIngredient(db, req, res);
            } else if (req.method === 'PUT') {
                editMultipleIngredients(db, req, res);
            } else {
                res.status(405).json({ message: 'Method Not Allowed' });
            }
        } else {
            res.status(500).json({ message: 'No connection to the Database' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
