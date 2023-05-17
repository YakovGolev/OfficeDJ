import { sendCkeckRequest } from "./messaging"

const apiKeyPattern = /\d{8,10}:[0-9A-Za-z_-]{35}/

export const checkIsApiKeyAsync = async (apiKey: string): Promise<boolean> => apiKeyPattern.test(apiKey) && await sendCkeckRequest(apiKey)