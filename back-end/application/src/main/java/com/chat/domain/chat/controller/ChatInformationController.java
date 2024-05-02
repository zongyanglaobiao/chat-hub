package com.chat.domain.chat.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chat.controller.Controller;
import com.chat.domain.chat.entity.SysChatInformation;
import com.common.resp.RespEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author xxl
 * @since 2024/4/17
 */
@RestController
@RequestMapping("/chat/information")
@Tag(name = "聊天信息")
@Validated
public class ChatInformationController extends Controller {

    //分页获取聊天信息
    @GetMapping("/page/getChatInfo")
    public RespEntity<Page<SysChatInformation>> getChatInfo(@RequestParam String roomId) {
        return RespEntity.success(chatInformationService.getChatInformationByRoomId(roomId));
    }

}
