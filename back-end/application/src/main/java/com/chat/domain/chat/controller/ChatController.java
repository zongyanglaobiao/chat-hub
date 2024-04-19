package com.chat.domain.chat.controller;

import cn.hutool.json.JSONUtil;
import com.chat.controller.Controller;
import com.chat.domain.chat.entity.MsgContext;
import com.chat.domain.chat.service.ChatInformationService;
import jakarta.annotation.Resource;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * @author xxl
 * @since 2024/4/9
 */
@ServerEndpoint("/chat/websocket/{roomId}")
@Slf4j
public class ChatController  {

    @Setter
    private static ChatInformationService chatInformationService;

    private static final HashMap<String, List<Session>> ON_LINE_USERS = new HashMap<>();

    /**
     * 连接建立时被调用
     */
    @OnOpen
    public void onOpen(Session session,@PathParam("roomId") String roomId) {
        //是否包含此聊天室
        if (ON_LINE_USERS.containsKey(roomId)) {
            List<Session> list = ON_LINE_USERS.get(roomId);
            list.add(session);
            ON_LINE_USERS.put(roomId, list);
            return;
        }

        ArrayList<Session> list = new ArrayList<>();
        list.add(session);
        ON_LINE_USERS.put(roomId, list);
    }

    /**
     * 连接关闭后移除session
     */
    @OnClose
    public void onClose(Session session) {
        String sessionId = session.getId();
        ON_LINE_USERS.values().parallelStream().forEach(list -> {
            list.forEach(t -> {
                try {
                    if (t.getId().equals(sessionId)) {
                        t.close();
                        list.remove(t);
                    }
                } catch (IOException e) {
                    log.error("用户离开聊天室失败: ", e);
                }
            });
        });
    }

    /**
     * 接收客户端信息之后会调用的
     */
    @OnMessage
    public void onMessage(String json, Session session) throws IOException {
        MsgContext context = JSONUtil.toBean(json, MsgContext.class);

        //保存聊天信息
        chatInformationService.saveInfo(context);

        if (!ON_LINE_USERS.containsKey(context.getRoomId())) {
            return;
        }
        ON_LINE_USERS.get(context.getRoomId()).parallelStream().forEach(t -> {
            //不通知当前用户
            if (t.equals(session)) {
                return;
            }
            //广播通知这个房间的的用户
            t.getAsyncRemote().sendText(json);
        });
    }

    @OnError
    public void whenSomethingGoesWrong(Throwable t) {
        log.error("websocket连接错误: ",t);
    }
}
