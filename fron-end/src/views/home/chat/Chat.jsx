import {Outlet, useNavigate} from "react-router-dom";
import {useEffect} from "react";
import {HOME_CHAT_WINDOW} from "@/router/index.jsx";

function Chat() {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(HOME_CHAT_WINDOW)
    }, []);

    return (
        <div>
            <Outlet/>
        </div>
    )
}

export default Chat