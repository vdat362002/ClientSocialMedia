import { LOGIN_SUCCESS, LOGOUT_SUCCESS, REGISTER_SUCCESS, UPDATE_AUTH_BACKGROUND, UPDATE_AUTH_INFO, UPDATE_AUTH_PICTURE } from '../../constants/actionType';

const initState = {
    id: '',
    username: '',
    fullname: '',
    profilePicture: {},
    background: {},
}

const authReducer = (state = initState, action) => {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return action.payload;
        case LOGOUT_SUCCESS:
            return initState;
        case REGISTER_SUCCESS:
            return action.payload;
        case UPDATE_AUTH_BACKGROUND:
            return {
                ...state,
                background: action.payload
            }
        case UPDATE_AUTH_PICTURE:
            return {
                ...state,
                profilePicture: action.payload
            }
        case UPDATE_AUTH_INFO:
            const { payload: user } = action;
            return {
                ...state,
                fullname: user.fullname,
            }
        default:
            return state;
    }
};

export default authReducer;
