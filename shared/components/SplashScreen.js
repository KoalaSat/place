import React from 'react';
import Head from 'next/head';
import Image from 'next/image';

import placeLogo from '../../public/place-192.png';

const SplashScreen = () => {
    return (
        <React.Fragment>
            <Head>
                <title>place - splash screen</title>
                <meta name="description" content="place - splash screen" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div className="splash-screen">
                <Image src={placeLogo} alt="place logo" />

                <div className="mt-2 fs-6 fw-800">place</div>
            </div>
        </React.Fragment>
    );
};

export default SplashScreen;
