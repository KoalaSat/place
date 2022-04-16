import { useEffect } from 'react';

import '../styles/globals.css';

import { AuthUserProvider } from '../shared/contexts/authUserContext';
import { PixelsProvider } from '../shared/contexts/pixelsContext';

function MyApp({ Component, pageProps }) {
    useEffect(() => {
        if (
            typeof window !== 'undefined' &&
            'serviceWorker' in navigator &&
            window.workbox !== undefined
        ) {
            const wb = window.workbox;
            const installNewVersion = () => {
                wb.addEventListener('controlling', () => {
                    window.location.reload();
                });

                wb.messageSkipWaiting();
            };

            wb.addEventListener('waiting', installNewVersion);
            wb.register();
        }

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
