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

const waitForCondition = async (condition: () => boolean): Promise<void> => {
  const timeout: number = 100
  const maxRetryCount = 100
  let count = 1
  return new Promise((resolve, reject) => {
    const interval = setInterval(() => {
      count++
      if (condition()) {
        clearInterval(interval)
        resolve()
      }
      if (count > maxRetryCount) {
        clearInterval(interval)
        reject(new Error('Превышено количество попыток выполнения действия'))
      }
    }, timeout)
  })
}
