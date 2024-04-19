import {Suspense} from "react";
import {Provider} from "react-redux";
import {useRoutes} from "react-router-dom";
import Loading from "@/component/Loading/Loading";
import routes from "@/router/index";
import {store} from "@/redux/store";


export  default  function App() {
    //路由
    const router = useRoutes(routes());
    return (
        <Suspense fallback={<Loading/>} >
            <Provider store={store}>
                {router}
            </Provider>
        </Suspense>
    )
}
