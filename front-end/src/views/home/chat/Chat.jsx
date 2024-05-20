import {Outlet} from "react-router-dom";

function Chat() {
    return (
        <div className='h-full w-full'>
            <Outlet/>
        </div>
    )
}

export default Chat