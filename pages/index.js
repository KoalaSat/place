import Head from 'next/head';

import Canvas from '../shared/components/Canvas';

export default function Home() {
    return (
        <div>
            <Head>
                <title>place</title>
                <meta name="description" content="place" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div>
                <Canvas />
            </div>
        </div>
    );
}
