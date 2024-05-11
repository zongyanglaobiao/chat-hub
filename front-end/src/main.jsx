import '@/index.css'
import 'virtual:uno.css'
import ReactDOM from 'react-dom/client';
import App from "@/views/App.jsx";
import {HashRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <HashRouter>
            <App/>
        </HashRouter>
    </>
)
