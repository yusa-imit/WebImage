// calls when drop event is triggered
export const dropEventListener=(e, func=()=>{})=>{
    e.preventDefault();
    e.stopPropagation();
    for(const f of e.dataTransfer.files){
        func(f.path);
    }
}


// calls when drag over event is triggered
export const dragOverListener=(e)=>{
    e.preventDefault();
    e.stopPropagation();
}

// calls when drag enter event is triggered
export const dragEnterListener=(e, f=()=>{})=>{
    f();
}


// calls when drag leaves without doing nothing
export const dragLeaveListner=(e, f=()=>{})=>{
    f();
}