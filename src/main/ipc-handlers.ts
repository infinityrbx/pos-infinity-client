import { IpcMainInvokeEvent, app, ipcMain } from 'electron'
import { addUser } from './db/users.js'
import {
  copyFileToTemp,
  copyImageFileToTemp,
  moveTempFileToImages,
  writePngUriToFile
} from './fs.js'

/** https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Remainder#description */
// function modulo(n: number, d: number): number {
//   return ((n % d) + d) % d
// }
// function wrappedAccess<T>(seq: ArrayLike<T>, idx: number): T {
//   const effectiveIdx = modulo(idx, seq.length)
//   return seq[effectiveIdx]
// }

const ChannelHandlers = {
  'app:getNameAndVersion': () => {
    return [app.getName(), app.getVersion()] as const
  },
  ...{
    ...{
      'db:addUser': async (
        _: IpcMainInvokeEvent,
        ...args: Parameters<typeof addUser>
      ): Promise<ReturnType<typeof addUser>> => {
        return await addUser(...args)
      }
    }
  },
  ...{
    'fs:writePngUriToFile': async (
      _: IpcMainInvokeEvent,
      ...args: Parameters<typeof writePngUriToFile>
    ): Promise<ReturnType<typeof writePngUriToFile>> => {
      return await writePngUriToFile(...args)
    },
    'fs:copyFileToTemp': async (
      _: IpcMainInvokeEvent,
      ...args: Parameters<typeof copyFileToTemp>
    ): Promise<ReturnType<typeof copyFileToTemp>> => {
      return await copyFileToTemp(...args)
    },
    'fs:copyImageFileToTemp': async (
      _: IpcMainInvokeEvent,
      ...args: Parameters<typeof copyImageFileToTemp>
    ): Promise<ReturnType<typeof copyImageFileToTemp>> => {
      return await copyImageFileToTemp(...args)
    },
    'fs:moveTempFileToImages': async (
      _: IpcMainInvokeEvent,
      ...args: Parameters<typeof moveTempFileToImages>
    ): Promise<ReturnType<typeof moveTempFileToImages>> => {
      return await moveTempFileToImages(...args)
    }
  }
} as const

/** https://stackoverflow.com/a/67605309 */
type ParametersExceptFirst<F> = F extends (arg0: any, ...rest: infer R) => any // eslint-disable-line @typescript-eslint/no-explicit-any
  ? R
  : never

export type Channel = keyof typeof ChannelHandlers
type Handler<T extends Channel> = (typeof ChannelHandlers)[T]
export type HandlerArgs<T extends Channel> = ParametersExceptFirst<Handler<T>> // Exclude first parameter which is the IPC event
export type HandlerValue<T extends Channel> = Awaited<ReturnType<Handler<T>>>

app.whenReady().then(() => {
  /**
   * Object keys union not automatically inferred by design of TS
   * - https://www.totaltypescript.com/iterate-over-object-keys-in-typescript
   * - https://github.com/Microsoft/TypeScript/issues/12870
   * - https://github.com/microsoft/TypeScript/issues/35101
   *
   * Keys union not really needed for the following, so just letting it be...
   */
  for (const [channel, handler] of Object.entries(ChannelHandlers)) {
    ipcMain.handle(channel, handler)
  }
})
