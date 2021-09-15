export async function sharpConvert(file, format){
    const sharp = require('sharp');
    const data = await sharp(file)
    .withMetadata()
    .toFormat(format)
    .toBuffer();
    return data;
}

//이 함수는 다시 컴포넌트 안에 구현할 것
//주고받아야 할 매개변수의 크기가 너무 큼
export async function sharpConvertAndExport(file, format, setInfo){
    const sharp = require('sharp');
    const imageConversion = require('image-conversion');
    const returnFileName = file.split('.')[0]+'__converted_by_WebImage.'+format;
    sharpConvert(file, format).then(
        buffer=>{
            /*
            /// image processing
            /// [deprecated]
            const url = imageConversion.filetoDataURL(new Blob([buffer])).then(
                data=>{
                    setData(data);
                }
            )*/
            sharp(new Uint8ClampedArray(buffer.buffer)).toFile(returnFileName)
            .then(info=>{
                setInfo(info)
            }
                
            );
            //info contains
            //format, width, height, size
            
        }
    )
}