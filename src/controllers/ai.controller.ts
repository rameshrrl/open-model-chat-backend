import { generateResponse } from "../helpers/response";
import { getResponseFromModel, getAvailableModels, getResponseFromModelUsingStream, getVisionResponseFromModelUsingStream as getVisionResponseFromModelUsingStreamService } from "../services/ai.service";

export const getChatResponseFromModel = async (req: any, res: any) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).send(generateResponse<null>('Message is required!'));
        }
        getResponseFromModel(message).then((response) => {
            res.status(200).send(generateResponse<string>('Response from AI model', true, response));
        }).catch((err) => {
            res.status(400).send(generateResponse<string>('Error in fetching data from model', false, err.message));
        });
    } catch (error) {
        res.status(500).send(generateResponse<null>('Error in getResponseFromModel!'));
    }
}

export const getAvailableModelsWithDetails = async (req: any, res: any) => {
    try {
        getAvailableModels().then((response) => {
            res.status(200).send(generateResponse<string>('Models fetched successfully!', true, response));
        }).catch((err) => {
            res.status(400).send(generateResponse<string>('Error in fetching model details', false, err.message));
        });
    } catch (error) {
        res.status(500).send(generateResponse<null>('Error in getAvailableModelsWithDetails!'));
    }
}

export async function getChatResponseFromModelUsingStream(req: any, res: any) {
    try {
        return await getResponseFromModelUsingStream(req, res);
    } catch (error) {
        return res.status(500).send(generateResponse<null>('Error in getChatResponseFromModelUsingStream!'));
    }
}

export async function getVisionResponseFromModelUsingStream(req: any, res: any) {
    try {
        return await getVisionResponseFromModelUsingStreamService(req, res);
    } catch (error) {
        return res.status(500).send(generateResponse<null>('Error in getVisionResponseFromModelUsingStream!'));
    }
}
