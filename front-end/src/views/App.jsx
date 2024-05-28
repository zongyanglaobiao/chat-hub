import {useRoutes} from "react-router-dom";
import routes from "@/router/index.jsx";
import Loading from "@/component/loading/Loading.jsx";
import {createContext, Suspense, useState} from "react";
import {Provider} from "react-redux";
import {store} from "@/redux/store.js";
import {Drawer} from "antd";

export const DrawerContext= createContext(null)

export  default  function App() {
    const router = useRoutes(routes());
    const [open, setOpen] = useState(false);
    const [reactNode, setReactNode] = useState((<p>无内容</p>))

    //开启抽屉
    const showDrawer = () => {
        setOpen(true);
    };

    //关闭抽屉
    const closeDrawer = () => {
        setOpen(false);
    };

    return (
        <DrawerContext.Provider value={{setReactNode,showDrawer,closeDrawer}}>
            <Suspense fallback={<Loading/>}>
                <Provider store={store}>
                    {router}
                    <Drawer styles={{body:{padding:'0px'}}}
                            title='信息展示'
                            onClose={()=>{ closeDrawer()}}
                            open={open}>
                        {reactNode}
                    </Drawer>
                </Provider>
            </Suspense>
        </DrawerContext.Provider>
    )
}


