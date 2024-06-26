package com.common.util;

import cn.hutool.jwt.JWT;
import cn.hutool.jwt.JWTUtil;
import com.common.exception.ChatException;
import com.common.resp.HttpCode;

import java.util.Map;

/**
 * @author xxl
 * @since 2024/2/28
 */
public class JWTUtils {

    private static final String JWT_HEADER = "e10adc3949ba59abbe56e057f20f883e";

    /**
     * 毫秒为单位
     */
    public static final long HALF_A_MONTH = 1000 * 60 * 60 * 24 * 15;

    private static final String EXPIRE_TIME = "expire_time";
    private static final String USER_ID = "ID";

    public static String getToken(String userId) {
        return getToken(HALF_A_MONTH,userId);
    }

    public static String getToken(long time,String userId) {
        return JWTUtil.createToken(Map.of(USER_ID, userId, EXPIRE_TIME, System.currentTimeMillis() + time), JWT_HEADER.getBytes());
    }

    /**
     * 如果TOKEN正常就返回
     * @param token 验证的TOKEN
     * @return 返回正常的TOKEN
     */
    public static String verifyToken(String token) {
        if (JWTUtil.verify(token, JWT_HEADER.getBytes())) {
            JWT jwt = JWTUtil.parseToken(token);
            if (Long.parseLong(jwt.getPayload(EXPIRE_TIME).toString()) < System.currentTimeMillis()) {
                throw new ChatException("TOKEN过期,请重新登录",HttpCode.FORBIDDEN.getCode());
            }
            return token;
        }
        throw new ChatException("TOKEN异常");
    }

    public static String getUserId(String token) {
        return JWTUtil.parseToken(token).getPayload(USER_ID).toString();
    }
}
