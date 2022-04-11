import '../styles/globals.css';

import { AuthUserProvider } from '../shared/contexts/authUserContext';

function MyApp({ Component, pageProps }) {
    return (
        <AuthUserProvider>
            <Component {...pageProps} />
        </AuthUserProvider>
    );
}

export default MyApp;
