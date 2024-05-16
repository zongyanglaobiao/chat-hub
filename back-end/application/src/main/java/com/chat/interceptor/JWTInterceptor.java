package com.chat.interceptor;

import cn.hutool.core.util.StrUtil;
import com.chat.domain.user.entity.LoginUser;
import com.chat.domain.user.entity.SysUser;
import com.chat.domain.user.service.UserService;
import com.common.exception.ChatException;
import com.common.resp.HttpCode;
import com.common.util.AssertUtils;
import com.common.util.JWTUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

/**
 * 过滤请求
 * @author xxl
 * @since 2023/11/21
 */
@Component
@RequiredArgsConstructor
public class JWTInterceptor implements HandlerInterceptor {

    private static final String AUTH = "auth";

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader(AUTH);
        token = StrUtil.isBlank(token) ? request.getHeader(AUTH.toLowerCase()) : token;
        if (StrUtil.isBlank(token)){
            throw  new ChatException("TOKEN不存在", HttpCode.FORBIDDEN.getCode());
        }
        //保存TOKEN
        LoginUser.store(token);
        return JWTUtils.verifyToken(token);
    }
}
