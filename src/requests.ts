const defaultPostRequest = {
  method: "POST", 
  mode: "cors", 
  cache: "no-cache",
  headers: {
    "Content-Type": "application/json",
  },
  redirect: "follow", 
  referrerPolicy: "no-referrer",
  body: undefined
}

/** Send GET request. */
export const getDataAsync = async <T> (url: URL): Promise<T> => {    
    const response = await fetch(url)
    const jsonData = await response.json()
  
    return jsonData
}

/** Prepare RequestInit object for POST request with body. */
export const postWithBody = (body: string): RequestInit => {
  return {...defaultPostRequest, body: body} as RequestInit
}
  