package com.chat.controller.exception;


import cn.hutool.jwt.JWTException;
import com.common.resp.HttpCode;
import com.common.resp.RespEntity;
import com.common.exception.ChatException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.concurrent.RejectedExecutionHandler;

/**
 * 对异常的统一返回
 * @author xxl
 * @since 2023/9/16
 */
@RestControllerAdvice
@Slf4j
public class ExceptionController {
    /**
     * 捕捉spring boot容器所有的未知异常
     */
    @ExceptionHandler(Exception.class)
    public RespEntity<?> exception(Exception exception) {
        if (exception instanceof ChatException com) {
            return RespEntity.fail(com.getCode(), com.getMsg());
        } else if (exception instanceof BindException bindException) {
            return RespEntity.fail(bindException.getFieldErrors().
                    stream().
                    map(FieldError::getDefaultMessage).
                    distinct().
                    toList().
                    toString());
        } else if (exception instanceof RejectedExecutionHandler) {
            return RespEntity.fail("系统繁忙,请稍后再试");
        } else if (exception instanceof JWTException){
            return RespEntity.fail(HttpCode.FORBIDDEN.getCode(), "TOKEN异常,请重新登录");
        } else if (exception instanceof IllegalArgumentException){
            return RespEntity.fail(exception.getMessage());
        } else if (exception instanceof HttpMessageNotReadableException) {
            return RespEntity.fail("请求参数异常");
        }
        return RespEntity.fail();
    }
}
