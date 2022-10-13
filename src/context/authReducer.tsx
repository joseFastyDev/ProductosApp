import { Usuario } from "../interfaces/appInterfaces";

export interface AuthState {
    status: 'checking' | 'authenticated' | 'not-authenticated';
    token: string | null;
    errorMessage: string;
    user: Usuario | null;
}

type AuthAction = 
    | { type: 'signIn', payload: { token: string, user: Usuario } }
    | { type: 'addError', payload: string }
    | { type: 'removeError' }
    | { type: 'notAuthenticated' }
    | { type: 'logout' }


export const authReducer = ( state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'addError':
            return {
                ...state,
                user: null,
                status: 'not-authenticated',
                token: null,
                errorMessage: action.payload
            }
        
        case 'removeError':
            return {
                ...state,
                errorMessage: ''
                
            };

        

        default:
                return state;
    }
}