import '../styles/globals.css';

import { AuthUserProvider } from '../shared/contexts/authUserContext';
import { PixelsProvider } from '../shared/contexts/pixelsContext';

function MyApp({ Component, pageProps }) {
    return (
        <AuthUserProvider>
            <PixelsProvider>
                <Component {...pageProps} />
            </PixelsProvider>
        </AuthUserProvider>
    );
}

export default MyApp;
