import { GetApiKeyAsync } from "storage/get_api_key"
import { sendMessageAsync } from "telegram/messaging"
import { getTelegramSendMessageUrl } from "telegram/pathes"
import { requestPlaylist } from "yandex_music/external_api/actions"

enum Command {
  playlist  
}

export const handleCommandAsync = async (message: string, chatId: number) => {

  const apiKey = await GetApiKeyAsync()
  
  if (message in Command === false){
    await sendMessageAsync(getTelegramSendMessageUrl(apiKey), chatId, 
      'Страшно, очень страшно! Мы не знаем что это такое, если бы мы знали что это такое, мы не знаем что это такое!')
    return
  }

  const command = Command[message as keyof typeof Command]
  switch (command) {
    case Command.playlist:
      await handlePlaylistCommandAsync(chatId)
  }  
}

const handlePlaylistCommandAsync = async (chatId: number) => {
    requestPlaylist(chatId)
}
