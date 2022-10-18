import React, { createContext } from 'react';

type ProductsContextProps = {
    products: 
}

export const ProductsContext = createContext({});


export const ProductsProvider = ({ children }: any ) => {

    return(
        <ProductsContext.Provider value={{

        }}>
            { children }
        </ProductsContext.Provider>
    )
}