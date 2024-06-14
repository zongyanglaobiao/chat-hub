package com.chat.domain.friend.controller;

import com.chat.controller.Controller;
import com.chat.domain.friend.entity.SysFriend;
import com.chat.domain.friend.enums.AgreeType;
import com.chat.domain.user.entity.LoginUser;
import com.common.resp.RespEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @author xxl
 * @since 2024/4/8
 */
@RestController
@RequestMapping("/user/friend")
@Validated
@Tag(name = "好友接口")
public class FriendController extends Controller {

    //查询好友列表{已经是好友、还未成为好友、被申请加好友}
    @GetMapping("doQueryFriend")
    public RespEntity<Object> doQueryFriend() {
        return RespEntity.success(friendService.doQueryFriend(LoginUser.getUserId()));
    }

    //申请加好友
    @GetMapping("doAddFriend/{friendId}")
    public RespEntity<Boolean> doAddFriend(@PathVariable("friendId") String friendId) {
        return RespEntity.success(friendService.doAddFriend(friendId,LoginUser.getUserId()));
    }

    //不同意/同意申请
    @GetMapping("doYesOrNoAgreeFriend/{id}")
    public RespEntity<Boolean> doYesOrNoAgreeFriend(@PathVariable("id") String id, @RequestParam AgreeType type) {
        return RespEntity.success(friendService.doYesOrNoAgreeFriend(id,LoginUser.getUserId(),type));
    }

    //删除好友
    @GetMapping("doDeleteFriend/{friendId}")
    public RespEntity<Boolean> doDeleteFriend(@PathVariable("friendId") String friendId) {
        return RespEntity.success(friendService.doDeleteFriend(friendId,LoginUser.getUserId()));
    }

    //是否为我的好友
    @GetMapping("doIsMyFriend/{friendId}")
    public RespEntity<Boolean> doIsMyFriend(@PathVariable("friendId") String friendId) {
        return RespEntity.success(friendService.doIsMyFriend(friendId,LoginUser.getUserId()));
    }

    //根据用户ID查询好友信息
    @GetMapping("doQueryFriendInfoByUserId/{userId}")
    public RespEntity<SysFriend> doQueryFriendInfoByUserId(@PathVariable("userId") String userId) {
        return RespEntity.success(friendService.doQueryFriendInfoByUserId(userId,LoginUser.getUserId()));
    }
}
