package com.chat.domain.base.search;

/**
 * @author xxl
 * @since 2024/5/18
 */
public interface Search<E,R> {
    /**
     *  搜索
     * @param keyword 关键字
     * @return 搜索类容
     */
    R doSearch(E keyword);
}
