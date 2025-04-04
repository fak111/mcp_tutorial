// 示例文件 - 复制为index.ts并填入您的API密钥
// 敏感凭证已移除

import express, { Request, Response } from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = 3006;

// 替换为您的实际API密钥
const COZE_API_KEY = 'YOUR_COZE_API_KEY_HERE';

app.use(cors());
app.use(express.json());

interface PodcastRequest {
    prompt: string;
}

app.post('/generate-podcast', async (req: Request, res: Response) => {
    try {
        const { prompt } = req.body as PodcastRequest;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        // 调用Coze API生成播客内容
        const response = await axios.post(
            'https://api.coze.com/v1/sections/7480537182273470476/completions',
            {
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${COZE_API_KEY}`,
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error:', errorMessage);
        res.status(500).json({ error: 'Failed to generate podcast' });
    }
});

app.listen(port, () => {
    console.log(`Podcast server running at http://localhost:${port}`);
});
