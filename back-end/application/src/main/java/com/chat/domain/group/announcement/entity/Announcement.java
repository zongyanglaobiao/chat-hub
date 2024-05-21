package com.chat.domain.group.announcement.entity;

import com.chat.domain.base.entity.Entity;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

/**
 * @author xxl
 * @since 2024/4/15
 */
@Data
public class Announcement implements Serializable {

    @Serial
    private static final long serialVersionUID = -3579392718210173686L;

    @JsonView({Entity.INSERT.class, Entity.UPDATE.class})
    private String title;

    @JsonView({Entity.INSERT.class, Entity.UPDATE.class})
    private String content;

}
