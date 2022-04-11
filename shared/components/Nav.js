import { useState } from 'react';
import { useAuth } from '../contexts/authUserContext';

const Nav = () => {
    const [continueWithGoogleError, setContinueWithGoogleError] = useState('');
    const handleContinueWithGoogle = () => {
        return continueWithGoogle().catch(() => {
            setContinueWithGoogleError(
                'Unable to get profile information from Google.'
            );
        });
    };

    const { authUser, continueWithGoogle } = useAuth();

    return (
        <nav>
            {authUser ? null : (
                <button onClick={handleContinueWithGoogle}>
                    continue with google
                </button>
            )}
        </nav>
    );
};

export default Nav;
