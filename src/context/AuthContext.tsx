import React, { createContext, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import cafeApi from '../api/cafeApi';
import { LoginData, LoginResponse, RegisterData, RegisterResponse, Usuario } from '../interfaces/appInterfaces';
import { authReducer, AuthState } from './authReducer';

type AuthContextProps = {
    errorMessage: string;
    token: string | null;
    user: Usuario | null;
    status: 'checking' | 'authenticated' | 'not-authenticated';
    signUp: ( registerData: RegisterData ) => void;
    signIn: ( loginData: LoginData ) => void;
    logOut: () => void;
    removeError: () => void;
}

const authInicialState: AuthState = {
    status: 'checking',
    token: null,
    user: null,
    errorMessage: ''
}

export const AuthContext = createContext({} as AuthContextProps);


export const AuthProvider = ({ children }: any)=> {

    const [ state, dispatch ] = useReducer( authReducer, authInicialState);
    
    useEffect(() => {
        checkToken();
    }, [])
    
    const checkToken = async () => {
        const token = await AsyncStorage.getItem('token');
        
        // No token, no autenticado
        if ( !token ) return dispatch({ type:'notAuthenticated' });

        // Hay token
        const { data } = await cafeApi.get('/auth');
        

        dispatch({
            type: 'signUp',
            payload: {
                token: data.token,
                user: data.usuario
            }
        });
    }

    const signIn = async({ correo, password }: LoginData ) => {
        
        try {
            
            const { data } = await cafeApi.post<LoginResponse>('/auth/login', { correo, password });
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);
            
        } catch (error: any) {
            console.log(error.response.data.msg);
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Información incorrecta'
            })
        }
        
        
    };
    
    const signUp = async({ nombre, correo, password}: RegisterData ) => {

        try {
            const { data } = await cafeApi.post<RegisterResponse>('/usuarios', { nombre, correo, password });
            dispatch({
                type: 'signUp',
                payload: {
                    token: data.token,
                    user: data.usuario
                }
            });

            await AsyncStorage.setItem('token', data.token);
            
        } catch (error: any) {
            console.log(error.response.data.msg);
            dispatch({
                type: 'addError',
                payload: error.response.data.msg || 'Información incorrecta'
            })
        }
    };

    const logOut = async () => {
        await AsyncStorage.removeItem('token');
        dispatch({ type: 'logout' });
    };
    
    const removeError = () => {
        dispatch({ type: 'removeError' });
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            signUp,
            signIn,
            logOut,
            removeError,
        }}>
            { children }
        </AuthContext.Provider>
    )
}
