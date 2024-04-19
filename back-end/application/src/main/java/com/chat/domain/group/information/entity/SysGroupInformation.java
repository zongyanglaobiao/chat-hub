package com.chat.domain.group.information.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.chat.domain.base.Entity;
import com.chat.domain.group.announcement.entity.SysGroupAnnouncement;
import com.chat.domain.group.member.entity.SysGroupMember;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;
import java.util.List;

/**
 * (SysGroupInformation)表实体类
 *
 * @author makejava
 * @since 2024-04-08 17:49:49
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SysGroupInformation extends Entity {

    @Serial
    private static final long serialVersionUID = -7772955908646840848L;

    //群昵称
    @JsonView({Entity.INSERT.class, Entity.UPDATE.class})
    @NotBlank(message = "群昵称不能为空", groups = {Entity.INSERT.class,Entity.UPDATE.class})
    private String groupName;

    //群头像
    @JsonView({Entity.INSERT.class, Entity.UPDATE.class})
    @NotBlank(message = "群头像不能为空", groups = {Entity.INSERT.class,Entity.UPDATE.class})
    private String avatar;

    //群主
    @JsonView(Entity.UPDATE.class)
    @NotBlank(message = "群主不能为空", groups = {Entity.UPDATE.class})
    private String createUserId;

    //群所有公告
    @TableField(exist = false)
    @JsonView(IGNORE.class)
    private List<SysGroupAnnouncement> announcements;

    //所有群成员{正式|未同意|审核中}
    @TableField(exist = false)
    @JsonView(IGNORE.class)
    private List<SysGroupMember> members;


}

