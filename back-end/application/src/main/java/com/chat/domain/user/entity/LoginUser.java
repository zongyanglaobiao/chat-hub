package com.chat.domain.user.entity;

import cn.hutool.core.util.StrUtil;
import com.chat.domain.user.service.UserService;
import com.common.exception.ChatException;
import com.common.util.JWTUtils;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Getter
@Component
public class LoginUser {

    private static UserService userService;

    private final static ThreadLocal<String> LOCAL = new ThreadLocal<>();

    private UserService userServiceTemp;

    @Autowired
    public void setUserServiceTemp(UserService temp) {
        this.userServiceTemp = temp;
        LoginUser.userService = getUserServiceTemp();
    }
    
    public static void store(String token) {
        LOCAL.set(token);
    }

    public static String getToken() {
        String token = LOCAL.get();
        if (StrUtil.isBlank(token)) {
            throw new ChatException("TOKEN不存在请重新登录");
        }
        return JWTUtils.verifyToken(token) ? token : null;
    }

    public static SysUser getUser() {
        SysUser user = userService.getById(JWTUtils.getUserId(getToken()));
        user.setToken(getToken());
        return user;
    }

    public static String getUserId() {
        return JWTUtils.getUserId(getToken());
    }
}
