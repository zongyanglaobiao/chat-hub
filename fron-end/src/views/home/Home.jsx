import reactSvg from '@/assets/react.svg';
import viteSvg from '@/assets/vite.svg';

const Home = () => {
    return (
        <>
            <div className='w-full h-100vh layout-center'>
                <div>
                    <div className='layout-center w-full'>
                        <img src={reactSvg} alt="react" className='w-100px h-100px'/>
                        <h1>+</h1>
                        <img src={viteSvg} alt="vite" className='w-100px h-100px'/>
                    </div>
                    <div className='text-center text-2xl mt-20px'>
                        Hello,React + Vite
                    </div>
                </div>
            </div>
        </>
    )
}

export default Home;