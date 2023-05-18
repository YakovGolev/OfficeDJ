import { getDataAsync } from "requests";
import { ITelegramApiResponse } from "./interfaces";
import { getGetUpdatesUrl } from "./messaging";

/** Build Telegram Request URL */
export const getUpdatesAsync = async (offsetChanged: boolean, lastOffset: number) => {
  const url = buildTelegramUrl(offsetChanged, lastOffset)
  return await getDataAsync<ITelegramApiResponse>(url)
}

const buildTelegramUrl = (offsetChanged: boolean, lastOffset: number) => {
  const url = getGetUpdatesUrl()
  if (offsetChanged)
    url.searchParams.append('offset', (lastOffset + 1).toString());
  if (!offsetChanged && lastOffset !== 0)
    url.searchParams.append('offset', lastOffset.toString());
  url.searchParams.append('timeout', '120');
  url.searchParams.append('limit', '1');

  return url;
};
