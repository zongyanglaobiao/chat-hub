package com.chat.domain.group.announcement.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableName;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import com.chat.domain.base.Entity;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;

/**
 * (SysGroupAnnouncement)表实体类
 *
 * @author makejava
 * @since 2024-04-08 17:56:02
 */
@EqualsAndHashCode(callSuper = true)
@Data
@TableName(value = "sys_group_announcement",autoResultMap = true)
public class SysGroupAnnouncement extends Entity {

    /**
     * 置顶
     */
    public static final int  TOP_YES = 1;

    /**
     * 不置顶
     */
    public static final int TOP_NO = 0;

    @Serial
    private static final long serialVersionUID = -625463783894308756L;

    //群ID
    @JsonView(INSERT.class)
    @NotBlank(message = "群ID不能为空",groups = {INSERT.class})
    private String groupId;

    //评论内容可以是对象
    @JsonView({INSERT.class,UPDATE.class})
    @NotNull(message = "内容不能为空",groups = {INSERT.class,UPDATE.class})
    @TableField(typeHandler = JacksonTypeHandler.class)
    private Announcement announcement;

    //用户ID
    @JsonView(IGNORE.class)
    private String userId;

    //是否置顶 1 置顶 0 不置顶
    @JsonView({INSERT.class,UPDATE.class})
    @Min(value = 0,message = "最小置顶为0",groups = {INSERT.class,UPDATE.class})
    @Max(value = 1,message = "最大置顶为1",groups = {INSERT.class,UPDATE.class})
    private Integer enableTop;
}

