package com.chat.domain.common.model;

import java.io.Serializable;

/**
 * @author xxl
 * @since 2024/5/18
 */
public enum SearchType implements Serializable{

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
