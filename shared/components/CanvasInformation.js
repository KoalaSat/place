const CanvasInformation = ({ authUser, timer }) => {
    if (authUser === null) {
        return <p>log in to start placing pixels</p>;
    }
    if (timer === 0) {
        return <p>place a pixel</p>;
    }

    return <p>next pixel in: {timer} seconds</p>;
};

export default CanvasInformation;
