package com.chat.domain.common.service;

import com.chat.domain.common.model.SearchType;
import com.chat.domain.common.response.SearchResponse;
import com.chat.domain.group.information.service.GroupInformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * @author xxl
 * @since 2024/5/18
 */
@Component
@RequiredArgsConstructor
public class GroupSearch implements ISearch {

    private final GroupInformationService groupInformationService;

    @Override
    public SearchResponse getSearchContent(String keyword) {
        return new SearchResponse().setGroups(groupInformationService.doSearch(keyword));
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.GROUP;
    }
}
