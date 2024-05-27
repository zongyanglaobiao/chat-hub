import  './index.css'

const  Loading = () =>  {
    return (
        <div className='layout-center h-100vh'>
            <div className="loader-container">
                <div className="loader"></div>
                <div className="loader-text">Loading...</div>
            </div>
        </div>
    )
}

export default Loading