/** Try get Url from string. */
export const tryGetTrackUrl = (message: string): URL | undefined => {
  try {
    return new URL(message)
  } catch {
    return
  }
}

/** Click page element by selector. */
export const clickButton = (selector: string): void => {
  (document.querySelector(selector) as HTMLElement)?.click()
}

/** Set timeout with awaiting. */
export const sleep = async (timeout: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

/** Wait for DOM element exists by selector. */
export const waitForElementLoaded = async (selector: string): Promise<void> => {
  await waitForCondition(() => document.querySelector(selector) !== null)
}

export const waitForCondition = async (condition: () => boolean, maxRetryCount: number = 100, timeout: number = 100): Promise<void> => {
  let count = 1
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      count++
      if (condition()) {
        clearInterval(interval)
        resolve()
      }
      if (count > maxRetryCount && maxRetryCount !== -1) {
        clearInterval(interval)
        reject(new Error('Превышено количество попыток выполнения действия'))
      }
    }, timeout)
  })
}

export const waitForAsyncCondition = async (condition: () => Promise<boolean>, maxRetryCount: number = 100, timeout: number = 100): Promise<void> => {
  let count = 1
  return new Promise((resolve, reject) => {
    const interval = setInterval(async () => {
      count++
      if (await condition()) {
        clearInterval(interval)
        resolve()
      }
      if (count > maxRetryCount && maxRetryCount !== -1) {
        clearInterval(interval)
        reject(new Error('Превышено количество попыток выполнения действия'))
      }
    }, timeout)
  })
}

export const dateToString = (date: Date) => {
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDay().toString().padStart(2, '0')

  return `${year}.${month}.${day}`
}
