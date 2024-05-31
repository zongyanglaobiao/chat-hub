package com.chat.domain.group.information.enums;

/**
 * @author xxl
 * @since 2024/4/9
 */
public enum GetType {
    /**
     * 我自己的群聊（群主是我）
     */
    MY,
    /**
     * 我所在的群聊(不包括群主是自己的群聊)
     */
    IN,
    /**
     * 我参与的群聊（群主是我 + 我是群成员）
     */
    ALL
    ;
}
