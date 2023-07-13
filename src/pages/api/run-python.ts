import { spawn } from 'child_process';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { text, del } = req.body;
        const python = spawn('python', ['src/scripts/string-manipulation.py', text, del]);
        let result = '';

        python.stdout.on('data', (data) => {
            result += data.toString();
        });
        python.stderr.on('data', (data) => {
            console.error(`stderr: ${data}`);
            res.status(500).json({ message: result });
        })
        python.on('close', (code) => {
            res.status(200).json({ message: result });
        });
        python.on('error', (error) => {
            console.error('Python process error:', error);
            res.status(500).json({ message: 'An error occurred during Python script execution' });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
}
