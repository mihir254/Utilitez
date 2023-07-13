import clientPromise from '@/src/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from "mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client?.db("KitchenDatabase");
        switch (req.method) {
            case "POST":
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
                break;
            case "GET":
                const allIngredients = await db?.collection("Ingredients").find({}).toArray();
                res.status(200).json({ message: "Fetched Data Successfully", data: allIngredients });
                break;
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
