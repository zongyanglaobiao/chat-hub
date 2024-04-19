package com.chat.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.chat.domain.chat.controller.ChatController;
import com.chat.domain.chat.service.ChatInformationService;
import com.common.log.AsyncLogger;
import com.common.util.TheadUtils;
import com.chat.toolkit.utils.IPUtils;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import java.util.Date;
import java.util.concurrent.ThreadPoolExecutor;

/**
 * 系统的相关配置
 *
 * @author xxl
 * @since 2024/2/23
 */
@Configuration
public class ChatConfiguration implements MetaObjectHandler {

    @Bean
    public ThreadPoolExecutor executor() {
        return TheadUtils.createThreadPool();
    }

    @Bean
    public AsyncLogger logger(ThreadPoolExecutor executor) {
        return new AsyncLogger(executor);
    }

    @Bean
    public static IPUtils ipUtils() {
        return IPUtils.getInstance("/data/ip2region.xdb");
    }

    @Override
    public void insertFill(MetaObject metaObject) {
        metaObject.setValue("createTime",new Date());
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        metaObject.setValue("updateTime",new Date());
    }

    /**
     * 自动注册使用ServerEndpoint注解
     */
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

    @Bean
    public ChatController chatController(ChatInformationService chatInformationService) {
        ChatController chatController = new ChatController();
        chatController.setChatInformationService(chatInformationService);
        return chatController;
    }
}
