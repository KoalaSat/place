const CanvasInformation = ({ authUser, timer }) => {
    if (authUser === null) {
        return <p className="fw-800">log in to start placing pixels</p>;
    }
    if (timer === 0) {
        return <p className="fw-800">place a pixel</p>;
    }

    return (
        <p>
            next pixel in: <span className="fw-800">{timer} seconds</span>
        </p>
    );
};

export default CanvasInformation;
