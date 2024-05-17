package com.chat.domain.common.model;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

/**
 * @author xxl
 * @since 2024/5/18
 */
public enum SearchType {

    //用户搜索
    USER,

    //群搜索
    GROUP,

    //好友搜索
    FRIEND,

    //所有
    ALL
    ;

}
