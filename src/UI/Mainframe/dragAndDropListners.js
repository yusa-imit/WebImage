export const dropEventListener=(e, func=()=>{})=>{
    e.preventDefault();
    e.stopPropagation();
    for(const f of e.dataTransfer.files){
        func(f.path);
    }
}

export const dragOverListener=(e)=>{
    e.preventDefault();
    e.stopPropagation();
}
export const dragEnterListener=(e, f=()=>{})=>{
    console.log('file is in the Drop Space');
    f();
}

export const dragLeaveListner=(e, f=()=>{})=>{
    console.log('file has left the Drop Space');
    f();
}