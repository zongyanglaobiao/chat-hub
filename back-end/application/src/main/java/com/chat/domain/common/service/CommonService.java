package com.chat.domain.common.service;

import com.chat.domain.group.information.service.GroupInformationService;
import com.chat.domain.user.service.UserService;
import com.common.resp.RespEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @author xxl
 * @since 2024/4/9
 */
@Service
@RequiredArgsConstructor
public class CommonService {

    private final UserService userService;

    private final GroupInformationService informationService;

    private static final String GROUP = "group";

    private static final String USER = "user";

    public Object search(String keyword) {
        return Map.of(GROUP,informationService.search(keyword),USER,userService.search(keyword));
    }
}
