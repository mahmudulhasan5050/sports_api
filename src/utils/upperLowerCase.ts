export const firstLetterUpperCase = (word: string) =>{
    return word
    .split(' ')
    .map(w => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
 }