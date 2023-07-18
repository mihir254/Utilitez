import clientPromise from '@/src/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, ObjectId } from "mongodb";

const getAllDishes = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const allDishes = await db?.collection("Dishes").find({}).toArray();
    res.status(200).json({ message: "Fetched Dishes Successfully", data: allDishes });
}

const createDish = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const {name, cuisine, nutrition, preferredMeal, ingredients} = JSON.parse(req.body);
    let bodyObj = {
        _id: new ObjectId(),
        name,
        cuisine,
        nutrition,
        preferredMeal,
        ingredients,
    }
    let newDish = await db?.collection("Dishes").insertOne(bodyObj);
    res.status(201).json({ message: newDish });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client?.db("KitchenDatabase");
        if (db) {
            if (req.method === 'GET') {
                getAllDishes(db, req, res);
            } else if (req.method === 'POST') {
                createDish(db, req, res);
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
