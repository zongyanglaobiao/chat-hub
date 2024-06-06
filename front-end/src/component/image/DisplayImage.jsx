import {Image} from "antd";

export function DisplayNoneImage({setVisible,visible,imgUrl}) {
    return (
        <Image
            style={{display: 'none'}}
            src={imgUrl}
            preview={{
                visible:visible,
                destroyOnClose:true,
                onVisibleChange:()=> setVisible((prev)=>!prev)
            }}
        />
    )
}