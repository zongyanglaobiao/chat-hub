import {useEffect} from "react";

/**
 *  用户展示群/用户信息的页面
 */
const SHOW_GROUP = "group";
const SHOW_USER = "user";

const Info = ({id,type}) => {

    useEffect(() => {

    }, [id,type]);


    return (
        <div>
            <header>
                头部区域
            </header>
            <main>
                身体区域
            </main>
        </div>
    )
}


export default Info
export {SHOW_GROUP,SHOW_USER}