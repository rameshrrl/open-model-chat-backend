import { generateResponse } from "../helpers/response";
import { askGemma } from "../services/ai.service";

export const getChatResponseFromModel = async (req: any, res: any) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).send(generateResponse<null>('Message is required!'));
        }
        askGemma(message).then((response) => {
            res.status(200).send(generateResponse<string>('Response from AI model', true, response));
        }).catch((err) => {
            res.status(200).send(generateResponse<string>('Error in fetching data from model',));
        });
    } catch (error) {
        res.status(500).send(generateResponse<null>('Error in getChatResponseFromModel!'));
    }
}