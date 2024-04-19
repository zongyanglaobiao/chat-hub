package com.chat.controller;

import com.chat.domain.chat.service.ChatInformationService;
import com.chat.domain.common.service.CommonService;
import com.chat.domain.group.information.service.GroupInformationService;
import com.chat.domain.file.service.FileService;
import com.chat.domain.friend.service.FriendService;
import com.chat.domain.user.service.UserService;
import jakarta.annotation.Resource;
import lombok.Data;

/**
 * 基础控制器
 *
 * @author xxl
 * @since 2024/2/27
 */
@Data
public class Controller {

    @Resource
    protected UserService userService;

    @Resource
    protected FileService fileService;

    @Resource
    protected FriendService friendService;

    @Resource
    protected GroupInformationService groupInformationService;

    @Resource
    protected ChatInformationService chatInformationService;

    @Resource
    protected CommonService commonService;
}
