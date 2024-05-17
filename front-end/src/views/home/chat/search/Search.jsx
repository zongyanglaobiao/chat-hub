import {LeftCircleTwoTone} from "@ant-design/icons";
import {useLocation, useNavigate} from "react-router-dom";
import {Button} from "antd";

function Search() {
    const location = useLocation();
    //从哪里来的就从哪里回
    const navigate = useNavigate();

    return (
        <div>
            <header>
                <LeftCircleTwoTone style={{fontSize: 50}} onClick={()=>navigate(location.state)}/>
                <Button onClick={()=>{
                    //发出请求
                }}>
                    获取search value
                </Button>
            </header>
            <main>

            </main>
        </div>
    )
}


export default Search;