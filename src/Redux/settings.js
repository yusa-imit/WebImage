const INITIAL_STATE={
    test : true
}

export const settings = (state=INITIAL_STATE, action)=>{
    switch(action.type){
        case 'SET_SETTINGS_TEST':
            return{
                ...state,
                test:!state.test,
            }
        default:
            return state;
    }
}

export default settings