import { useEffect } from 'react';

import '../styles/globals.css';

import { AuthUserProvider } from '../shared/contexts/authUserContext';
import { PixelsProvider } from '../shared/contexts/pixelsContext';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        if (!localStorage.getItem('theme')) {
            if (
                window.matchMedia &&
                window.matchMedia('(prefers-color-scheme: dark)').matches
            ) {
                localStorage.setItem('theme', 'dark');
            } else {
                localStorage.setItem('theme', 'light');
            }
        }

        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark');
        }
    }, []);

    return (
        <AuthUserProvider>
            <PixelsProvider>
                <Component {...pageProps} />
            </PixelsProvider>
        </AuthUserProvider>
    );
}

export default MyApp;
