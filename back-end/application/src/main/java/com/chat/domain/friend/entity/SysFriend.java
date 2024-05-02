package com.chat.domain.friend.entity;

import java.io.Serial;
import java.util.Date;

import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.chat.domain.base.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * (SysFriend)表实体类
 *
 * @author makejava
 * @since 2024-04-08 16:49:41
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SysFriend extends Entity {

    /**
     * 未同意
     */
    public static final int STATUS_NO = 0;
    /**
     * 同意
     */
    public static final int STATUS_YES = 1;

    /**
     * 未处理
     */
    public static final int STATUS_NOT_HANDLER = -1;

    @Serial
    private static final long serialVersionUID = -6161690588822904378L;

    private String userId;

    private String friendId;

    //好友状态{同意|未同意} 1 同意 0 为未同意 -1 未处理
    private Integer status;

    //发起人ID
    private String sponsorId;

    //聊天ID,默认每个用户都可能会聊天所以提前创建聊天ID
    private String chatId;
}

