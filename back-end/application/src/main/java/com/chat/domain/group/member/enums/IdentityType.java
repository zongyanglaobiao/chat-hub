package com.chat.domain.group.member.enums;

import com.baomidou.mybatisplus.annotation.IEnum;

/**
 * @author xxl
 * @since 2024/4/9
 */
public enum IdentityType implements IEnum<String> {


    /**
     * 普通成员
     */
    MEMBER,
    /**
     * 群主
     */
    LORD
    ;

    @Override
    public String getValue() {
        return name();
    }
}
