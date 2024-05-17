package com.chat.domain.common.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * @author xxl
 * @since 2024/5/18
 */
@Getter
@RequiredArgsConstructor
public enum SearchType {

    //用户搜索
    USER("user"),

    //群搜索
    GROUP("group"),

    //好友搜索
    FRIEND("friend"),

    //所有
    ALL("all")
    ;

    private final String name;
}
