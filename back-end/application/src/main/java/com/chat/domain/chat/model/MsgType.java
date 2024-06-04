package com.chat.domain.chat.model;

import com.baomidou.mybatisplus.annotation.IEnum;

/**
 * @author xxl
 * @since 2024/6/4
 */
public enum MsgType implements IEnum<String> {
    /**
     * 文本信息
     */
    TEXT,
    /**
     * 图片类型
     */
    IMG_URL;

    @Override
    public String getValue() {
        return name();
    }
}
