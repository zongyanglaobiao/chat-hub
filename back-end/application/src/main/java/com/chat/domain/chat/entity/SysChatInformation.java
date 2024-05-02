package com.chat.domain.chat.entity;

import java.io.Serial;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.chat.domain.base.Entity;
import com.chat.domain.user.entity.SysUser;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.util.List;

/**
 * (SysChatInformation)表实体类
 *
 * @author makejava
 * @since 2024-04-09 10:29:50
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName(value = "sys_chat_information", autoResultMap = true)
public class SysChatInformation extends Entity {

    @Serial
    private static final long serialVersionUID = -8901114683277937879L;

    //聊天室ID重复出现(如果是群聊的话则是指群ID，如果是单聊则是指双方的id相加)
    private String roomId;

    //用户ID
    @TableField(typeHandler = JacksonTypeHandler.class)
    private SysUser user;

    //发送时间
    private Date sendTime;

    //信息内容 可以是json
    @TableField(typeHandler = JacksonTypeHandler.class)
    private String information;

    //序号
    private Integer serialNumber;

    private SysChatInformation() {}

    public static SysChatInformation create(Integer serialNumber, String roomId, SysUser user, String information) {
        SysChatInformation chatInformation = new SysChatInformation();
        chatInformation.setRoomId(roomId);
        chatInformation.setUser(user);
        chatInformation.setSerialNumber(serialNumber);
        chatInformation.setSendTime(new Date());
        chatInformation.setInformation(information);
        return chatInformation;
    }

}

