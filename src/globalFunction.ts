export const globalFunction = {

  /**
   * Retourne un Id sous forme de String composé de X caractères
   *
   * @param length - La longeur de l'Id à retourner
   * @returns Un Id sous forme de string
   *
   */
  makeId (length:number): string {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  }
}
