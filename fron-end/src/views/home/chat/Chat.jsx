import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {HOME_CHAT} from "@/router/index.jsx";

function Chat() {
    return (
        <div className='h-full w-full'>
            <Outlet/>
        </div>
    )
}

export default Chat