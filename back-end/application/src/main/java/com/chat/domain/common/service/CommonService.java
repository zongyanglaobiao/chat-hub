package com.chat.domain.common.service;

import com.chat.domain.base.search.Search;
import com.chat.domain.common.model.SearchType;
import com.chat.domain.common.request.SearchRequest;
import com.chat.domain.common.response.SearchResponse;
import com.common.exception.ChatException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author xxl
 * @since 2024/4/9
 */
@Service
@RequiredArgsConstructor
public class CommonService implements Search<SearchRequest,SearchResponse> {

    private final List<ISearch> searches;

    @Override
    public SearchResponse doSearch(SearchRequest request) {
        return getSearches(request.getSearchType()).getSearchContent(request.getKeyword());
    }

    private ISearch getSearches(SearchType type) {
        return searches.parallelStream().
                filter(t -> t.getSearchType().equals(type)).
                findFirst().
                orElseThrow(() -> new ChatException("搜索类型不存在"));
    }
}
