import {useRoutes} from "react-router-dom";
import routes from "@/router/index.jsx";
import Loading from "@/component/loading/Loading.jsx";
import {createContext, Suspense, useRef, useState} from "react";
import {Provider} from "react-redux";
import {store} from "@/redux/store.js";
import {Drawer} from "antd";
import {DisplayNoneImage} from "@/component/image/DisplayImage.jsx";

export const DrawerContext= createContext(null)
export const DisplayNoneImageContext= createContext(null)

export  default  function App() {
    const router = useRoutes(routes());
    const [open, setOpen] = useState(false);
    const [reactNode, setReactNode] = useState((<p>无内容</p>))
    const [visible, setVisible] = useState(false)
    const imgUrlRef = useRef(null);

    //开启抽屉
    const showDrawer = (reactNode) => {
        setOpen(true);
        setReactNode(reactNode)
    };

    //关闭抽屉
    const closeDrawer = () => {
        setOpen(false);
    };

    const  openOrCloseImage = (imgUrl) => {
        imgUrlRef.current = imgUrl
        setVisible(prevState => !prevState)
    }

    return (
        <DisplayNoneImageContext.Provider value={{openOrCloseImage}}>
            <DisplayNoneImage setVisible={setVisible} visible={visible} imgUrl={imgUrlRef.current}/>
            <DrawerContext.Provider value={{showDrawer,closeDrawer}}>
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
        </DisplayNoneImageContext.Provider>
    )
}


