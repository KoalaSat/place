import { createContext, useContext } from 'react';

import SplashScreen from '../components/SplashScreen';

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
        return <SplashScreen />;
    }

    return (
        <authUserContext.Provider value={auth}>
            {children}
        </authUserContext.Provider>
    );
};

export const useAuth = () => useContext(authUserContext);
