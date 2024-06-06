import {Image} from "antd";
import {useEffect, useState} from "react";

export function DisplayImage({imgUrl,visible}) {
    const [visible_, setVisible_] = useState(visible)

    return (
        <Image
            style={{display: 'none'}}
            src={imgUrl}
            preview={{
                visible:visible_,
                destroyOnClose:true,
                onVisibleChange:()=> setVisible_(false)
            }}
        />
    )
}