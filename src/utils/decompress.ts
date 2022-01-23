import { inflate } from 'pako'

function decompressGzText(buffer: ArrayBuffer) {
  const inflated = inflate(new Uint8Array(buffer))
  return new TextDecoder().decode(inflated)
}

export function parseIcons(res: Response) {
  return res
    .arrayBuffer()
    .then(decompressGzText)
    .then(text => {
      // const dom = new DOMParser().parseFromString(string, "image/svg+xml")
      // Array.from(dom.getElementsByTagName('symbol'))
      return Array.from(
        text.matchAll(/<symbol id="(.*?)">(.*?)<\/symbol>/g)
      ).map(match => ({
        name: match[1],
        content: match[2].replace(/<(([a-z]+) [^/>]+)\/>/g, '<$1></$2>'),
      }))
    })
}
