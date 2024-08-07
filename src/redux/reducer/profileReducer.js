import { GET_USER_SUCCESS, UPDATE_BACKGROUND, UPDATE_COVER_PHOTO, UPDATE_PROFILE_INFO, UPDATE_PROFILE_PICTURE } from "../../constants/actionType";

const initState = {
    _id: '',
    id: '',
    username: '',
    email: '',
    fullname: '',
    firstname: '',
    lastname: '',
    info: {
        bio: '',
        birthday: '',
        gender: 'unspecified',
    },
    isEmailValidated: false,
    profilePicture: {},
    coverPhoto: {},
    background: {},
    followersCount: 0,
    followingCount: 0,
    dateJoined: ''
};

const profileReducer = (state = initState, action) => {
    switch (action.type) {
        case GET_USER_SUCCESS:
            return action.payload;
        case UPDATE_PROFILE_PICTURE:
            return {
                ...state,
                profilePicture: action.payload
            }
        case UPDATE_BACKGROUND:
            return {
                ...state,
                background: action.payload
            }
        case UPDATE_PROFILE_INFO:
            const { payload: user } = action;
            return {
                ...state,
                fullname: user.fullname,
                firstname: user.firstname,
                lastname: user.lastname,
                info: user.info
            }
        case UPDATE_COVER_PHOTO:
            return {
                ...state,
                coverPhoto: action.payload
            }
        default:
            return state;
    }
};

export default profileReducer;
