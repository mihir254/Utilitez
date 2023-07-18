import clientPromise from '@/src/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, ObjectId } from "mongodb";

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
    }
    let newIngredient = await db?.collection("Ingredients").insertOne(bodyObj);
    res.status(201).json({ message: newIngredient })
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
