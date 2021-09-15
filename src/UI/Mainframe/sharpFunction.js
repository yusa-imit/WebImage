export async function sharpConvert(file, format){
    const sharp = require('sharp');
    const data = await sharp(file)
    .toFormat(format)
    .toFile();
    return data;
}