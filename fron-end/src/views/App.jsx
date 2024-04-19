import {useRoutes} from "react-router-dom";
import routes from "@/router/index.jsx";
import Loading from "@/component/loading/Loading.jsx";
import {Suspense} from "react";
import {Provider} from "react-redux";
import {store} from "@/redux/store.js";


export  default  function App() {
    const router = useRoutes(routes());
    return (
        <Suspense fallback={<Loading/>}>
            <Provider store={store}>
                {router}
            </Provider>
        </Suspense>
    )
}

