package com.chat.domain.common.service;

import com.chat.domain.common.model.SearchType;
import com.chat.domain.common.response.SearchResponse;
import com.chat.domain.friend.request.SearchFriendRequest;
import com.chat.domain.friend.service.FriendService;
import com.chat.domain.user.entity.LoginUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

/**
 * @author xxl
 * @since 2024/5/18
 */
@Component
@RequiredArgsConstructor
public class FriendSearch implements ISearch {

    private final FriendService friendService;

    @Override
    public SearchResponse getSearchContent(String keyword) {
        return new SearchResponse().
                setFriends(friendService.doSearch(new SearchFriendRequest(keyword,LoginUser.getUserId())));
    }

    @Override
    public SearchType getSearchType() {
        return SearchType.FRIEND;
    }
}
