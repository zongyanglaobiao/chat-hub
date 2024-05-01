package com.chat.domain.user.controller;

import com.chat.controller.Controller;
import com.chat.domain.base.Entity;
import com.chat.domain.user.entity.LoginUser;
import com.chat.domain.user.entity.SysUser;
import com.common.resp.RespEntity;
import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author xxl
 * @since 2024/4/8
 */
@RestController
@RequestMapping("/user")
@Validated
@Tag(name = "用户接口")
public class UserController extends Controller {

    //修改用户 + 修改在线状态
    @PostMapping("/doModify")
    public RespEntity<Boolean> doModify(@RequestBody @JsonView({Entity.UPDATE.class}) @Validated(Entity.UPDATE.class) SysUser sysUser) {
        return RespEntity.success(userService.doModify(sysUser));
    }

    @PostMapping("/doLogin")
    public RespEntity<SysUser> doLogin(@RequestBody @JsonView(Entity.INSERT.class) @Validated(Entity.INSERT.class) SysUser sysUser) {
        return RespEntity.success(userService.doLogin(sysUser));
    }

    @PostMapping("/doRegister")
    public RespEntity<Boolean> doRegister(@RequestBody @JsonView({SysUser.REGISTER.class}) @Validated(SysUser.REGISTER.class) SysUser sysUser) {
        return RespEntity.success(userService.doRegister(sysUser));
    }

    //获取个用户信息有参数则查询无参数则查询自己
    @GetMapping("/doGetInfo")
    public RespEntity<SysUser> doGetInfo(@RequestParam(required = false) String userId) {
        return RespEntity.success(userService.doGetInfo(userId, LoginUser.getUser()));
    }

    //集合查询用户
    @PostMapping("/doQueryUserInfos")
    public RespEntity<List<SysUser>> doQueryUserInfos(@RequestBody List<String> userIds) {
        return RespEntity.success(userService.doQueryUserInfos(userIds));
    }

}
