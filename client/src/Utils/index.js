import {luckyPrompts} from "../Prompts";
import FileSaver from 'file-saver';
export function getRandomPrompt(prompt){
    const randomIndex = Math.floor(Math.random()*luckyPrompts.length);
    const randomPrompt = luckyPrompts[randomIndex];

    if(randomPrompt === prompt) return getRandomPrompt(prompt)

    return randomPrompt
}
export async function downloadImage(_id, photo){
    FileSaver.saveAs(photo, `download-${_id}.jpg`)
}