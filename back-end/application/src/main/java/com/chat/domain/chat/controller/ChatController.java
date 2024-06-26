package com.chat.domain.chat.controller;

import cn.hutool.json.JSONUtil;
import com.chat.domain.chat.entity.MsgContent;
import com.chat.domain.chat.service.ChatInformationService;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import lombok.Setter;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

/**
 * @author xxl
 * @since 2024/4/9
 */
@ServerEndpoint("/chat/websocket/{roomId}")
@Slf4j
public class ChatController {

    @Setter
    private static ChatInformationService chatInformationService;

    private static final ConcurrentHashMap<String, CopyOnWriteArrayList<Session>> ON_LINE_USERS = new ConcurrentHashMap<>();

    /**
     * 连接建立时被调用
     */
    @OnOpen
    public void onOpen(Session session, @PathParam("roomId") String roomId) {
        log.warn("websocket连接成功: {}", roomId);

        //是否包含此聊天室
        if (ON_LINE_USERS.containsKey(roomId)) {
            CopyOnWriteArrayList<Session> list = ON_LINE_USERS.get(roomId);
            list.add(session);
            ON_LINE_USERS.put(roomId, list);
            return;
        }

        CopyOnWriteArrayList<Session> list = new CopyOnWriteArrayList<>();
        list.add(session);
        ON_LINE_USERS.put(roomId, list);
    }

    /**
     * 连接关闭后移除session
     */
    @OnClose
    public void onClose(Session session) {
        String sessionId = session.getId();
        ON_LINE_USERS.forEach((k, v) -> {
            v.removeIf(t -> {
                if (t.getId().equals(sessionId)) {
                    try {
                        t.close();
                        return true;  // 表示应当从列表中移除
                    } catch (IOException e) {
                        log.error("用户离开聊天室失败: ", e);
                    }
                }
                return false;
            });

            if (v.isEmpty()) {
                ON_LINE_USERS.remove(k);
            }
        });
    }

    /**
     * 接收客户端信息之后会调用的
     */
    @OnMessage
    public void onMessage(String json, Session session) throws IOException {
        MsgContent context = JSONUtil.toBean(json, MsgContent.class);

        //保存聊天信息
        try {
            chatInformationService.saveInfo(context);
        } catch (RuntimeException e) {
            //如果发送错误则通知这个房间的任务并且通知这个人
            context.setCode(500);
            context.setText(e.getMessage());
            noticeErrorOfUser(session, context);
            return;
        }

        if (!ON_LINE_USERS.containsKey(context.getRoomId())) {
            return;
        }

        ON_LINE_USERS.get(context.getRoomId()).parallelStream().forEach(t -> {
            if (t.getId().equals(session.getId())) {
                //当前用户没必要通知
                return;
            }
            //广播通知这个房间的的用户
            t.getAsyncRemote().sendText(json);
        });
    }

    @OnError
    public void whenSomethingGoesWrong(Throwable t) {
        log.error("websocket连接错误: ", t);
    }

    private void noticeErrorOfUser(Session session, MsgContent content) {
        CopyOnWriteArrayList<Session> sessions = ON_LINE_USERS.get(content.getRoomId());
        for (Session tS : sessions) {
            if (tS.getId().equals(session.getId())) {
                session.getAsyncRemote().sendText(JSONUtil.toJsonStr(content));
                //通知这个用户之后立马退出循环
                return;
            }
        }
    }
}
