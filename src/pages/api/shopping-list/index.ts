import clientPromise from '@/src/lib/mongodb';
import { NextApiRequest, NextApiResponse } from 'next';
import { Db, ObjectId } from "mongodb";
import { ListItem } from '@/src/interfaces/list-item';

const clearShoppingList = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const filter = { shoppingList: true };
    const update = { $set: { shoppingList: false } };
    const ingredientResult = await db?.collection("Ingredients").updateMany(filter, update);
    const shoppingListResult = await db?.collection("Shopping List").deleteMany();
    res.status(201).json({ message: ingredientResult.modifiedCount > 0 || shoppingListResult.deletedCount > 0 ? "Shopping List has been cleared!" : "There was nothing to change" });
}

const getAllListItems = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const allListItems = await db?.collection("Shopping List").find({}).toArray();
    res.status(200).json({ message: "Fetched Data Successfully", data: allListItems });
}

const createListItem = async (db: Db, req: NextApiRequest, res: NextApiResponse) => {
    const incomingData = JSON.parse(req.body);
    console.log(incomingData);
    if (Array.isArray(incomingData)) {
        const insertItems = incomingData.map((item: ListItem) => ({_id: new ObjectId(item._id as string), itemName: item.itemName}));
        let newListItems = await db?.collection("Shopping List").insertMany(insertItems);
        res.status(201).json({ message: newListItems })
    } else {
        const {_id, itemName } = incomingData;
        let bodyObj = {
            _id: _id === '' ?  new ObjectId() : new ObjectId(_id as string),
            itemName
        }
        let newListItem = await db?.collection("Shopping List").insertOne(bodyObj);
        res.status(201).json({ message: newListItem })
    }
}


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const client = await clientPromise;
        const db = client?.db("KitchenDatabase");
        if (db) {
            if (req.method === 'GET') {
                getAllListItems(db, req, res);
            } else if (req.method === 'POST') {
                createListItem(db, req, res);
            } else if (req.method === 'PUT') {
                clearShoppingList(db, req, res);
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
