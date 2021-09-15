export async function sharpConvert(file, format){
    const sharp = require('sharp');
    const data = await sharp(file)
    .withMetadata()
    .toFormat(format)
    .toBuffer();
    return data;
}

export function sharpToFile(file){
    const sharp = require('sharp');
    const name = file.split('.')[0]+'converted'+'.'+file.split('1');
    sharp(file).toFile(name);
}