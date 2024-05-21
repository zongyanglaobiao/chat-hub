package com.chat.domain.base.search;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

/**
 * @author xxl
 * @since 2024/5/18
 */
public interface Search<E,T> {
    /**
     *  搜索
     * @param keyword 关键字
     * @return 搜索类容
     */
    Page<T> doSearch(E keyword, Page<T> page);
}
