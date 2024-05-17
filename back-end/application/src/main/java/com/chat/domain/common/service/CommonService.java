package com.chat.domain.common.service;

import com.chat.domain.common.request.SearchRequest;
import com.chat.domain.group.information.service.GroupInformationService;
import com.chat.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

import static com.chat.domain.common.model.SearchType.USER;

/**
 * @author xxl
 * @since 2024/4/9
 */
@Service
@RequiredArgsConstructor
public class CommonService {

    private final UserService userService;

    private final GroupInformationService informationService;

    public Object search(SearchRequest request) {



        return null;
    }
}
