import { createContext, useContext } from 'react';

import usePixels from '../hooks/usePixels';

const pixelsContext = createContext({
    pixel: null,
    pixels: []
});

export const PixelsProvider = ({ children }) => {
    const pixels = usePixels();

    return (
        <pixelsContext.Provider value={pixels}>
            {children}
        </pixelsContext.Provider>
    );
};

export const usePixelsContext = () => useContext(pixelsContext);
