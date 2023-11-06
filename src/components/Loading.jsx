import Lottie from "lottie-react";
import loadingJSON from "../assets/loading.json";

const Loading = () => {
    return (
        <div className='flex justify-center items-center flex-col'>
            <h1 className='text-2xl font-semibold pt-10'>Please Wait</h1>
            <Lottie animationData={loadingJSON} className='w-80' />
        </div>
    );
};

export default Loading;