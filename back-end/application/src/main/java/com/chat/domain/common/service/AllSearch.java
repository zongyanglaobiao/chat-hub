package com.chat.domain.common.service;

import com.chat.domain.common.model.SearchType;
import com.chat.domain.common.response.SearchResponse;
import com.chat.domain.friend.service.FriendService;
import com.chat.domain.group.information.service.GroupInformationService;
import com.chat.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * @author xxl
 * @since 2024/5/18
 */
@Component
@RequiredArgsConstructor
public class AllSearch implements ISearch {

    private final FriendService friendService;

    private final UserService userService;

    private final GroupInformationService groupInformationService;

    @Override

    public SearchResponse getSearchContent(String keyword) {
        return null;
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.ALL;
    }
}
