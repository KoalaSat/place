const CanvasInformation = ({ authUser, timer }) => {
    if (authUser === null) {
        return (
            <p className="mb-2 fw-800 t-center">
                log in to start placing pixels
            </p>
        );
    }
    if (timer === 0) {
        return <p className="mb-2 fw-800 t-center">place a pixel</p>;
    }

    return (
        <p className="mb-2 t-center">
            place pixel in: <span className="fw-800">{timer} seconds</span>
        </p>
    );
};

export default CanvasInformation;
