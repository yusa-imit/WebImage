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
export function sharpConvertAndExport(file, format, targetDest, setInfo, increaseProgress){
    const sharp = require('sharp');
    const formatChange = file.split('.')[0]+'__converted_by_WebImage.'+format;
    const arr = formatChange.split('\\')
    const fileName = arr.pop();
    const originDest = arr.join('\\');
    const target = targetDest==='Default'?originDest:targetDest;
    const returnFileName = target + '\\'+fileName;
    //console.log(returnFileName)
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
            //console.log(buffer);
            sharp(new Uint8ClampedArray(buffer.buffer)).toFile(returnFileName)
            .then(info=>{
                //console.log(info)
                setInfo(prevInfo => ({...prevInfo, file: info}))
            })
            .catch(e=>{console.log(e)})
            //info contains
            //format, width, height, size
            
        }
    )
    increaseProgress()
}