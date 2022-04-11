import { createContext, useContext } from 'react';

import useFirebaseAuth from '../hooks/useFirebaseAuth';

const authUserContext = createContext({
    authUser: null,
    loading: true,
    continueWithGoogle: () => {},
    signOutUser: () => {}
});

export const AuthUserProvider = ({ children }) => {
    const auth = useFirebaseAuth();

    if (auth.loading) {
        return <div>loading...</div>;
    }

    return (
        <authUserContext.Provider value={auth}>
            {children}
        </authUserContext.Provider>
    );
};

export const useAuth = () => useContext(authUserContext);
