package com.chat.domain.common.service;

import com.chat.domain.common.model.SearchType;
import com.chat.domain.common.response.SearchResponse;
import com.chat.domain.user.service.UserService;
import com.chat.toolkit.utils.CommonPageRequestUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * @author xxl
 * @since 2024/5/18
 */
@Component
@RequiredArgsConstructor
public class UserSearch implements ISearch {

    private final UserService userService;

    @Override
    public SearchResponse getSearchContent(String keyword) {
        return new SearchResponse().setUsers(userService.doSearch(keyword,CommonPageRequestUtils.defaultPage()));
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.USER;
    }
}
