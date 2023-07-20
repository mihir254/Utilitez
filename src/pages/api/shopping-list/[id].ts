import clientPromise from '@/src/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, ObjectId } from "mongodb";

const deleteListItem = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const objectID = new ObjectId(id as string);
    const deleteResult = await db?.collection("Shopping List").deleteOne({ _id: objectID });
    if (deleteResult.deletedCount === 1) {
        res.status(200).json({ message: "Item deleted succesfully" });
    } else {
        res.status(404).json({ message: "Item not found" });
    }
}

const editListItem = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const { id } = req.query;
    const objectID = new ObjectId(id as string);
    const { itemName } = JSON.parse(req.body);
    const updateResult = await db?.collection("Shopping List").updateOne(
        { _id: objectID },
        { $set: { itemName } }
    );
    if (updateResult.modifiedCount === 1) {
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
            if (req.method === 'DELETE') {
                deleteListItem(db, req, res);
            } else if (req.method === 'PUT') {
                editListItem(db, req, res);
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
