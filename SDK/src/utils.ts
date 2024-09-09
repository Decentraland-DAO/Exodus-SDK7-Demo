import * as utils from '@dcl-sdk/utils'


export function getRandomHexColor(): string {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function setTimeout(time: number, method: () => void) : void {
  utils.timers.setTimeout(method,time)
}


export const sleep = async(time: number): Promise<void> => {
  await new Promise<void>((resolve) => {
      setTimeout(time, resolve);
  })
}