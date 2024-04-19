import {lazy} from "react";

const Home = lazy(() => import('/src/views/home/Home'))

export default function routes() {
    return [
        {
            path: "/",
            element: <Home/>
        }
    ];
}