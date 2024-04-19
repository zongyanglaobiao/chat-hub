package com.chat.domain.chat.entity;

import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author xxl
 * @since 2024/4/16
 */
@Data
public class MsgContext  implements Serializable {

    @Serial
    private static final long serialVersionUID = -2607785317442125949L;

    private String text;

    private String roomId;

    private String userId;
}
