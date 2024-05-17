package com.chat.domain.common.service;

import com.chat.domain.common.model.SearchType;
import com.chat.domain.common.response.SearchResponse;

/**
 * 基础搜索实现类
 * @author xxl
 * @since 2024/5/18
 */
public interface ISearch {

    /**
     * 获取搜索内容
     * @param keyword 关键字
     * @return 搜索结果
     */
    SearchResponse getSearchContent(String keyword);

    /**
     * 获取搜索类型
     * @return 搜索类型
     */
    SearchType getSearchType();
}
