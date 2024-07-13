package com.chat.domain.group.member.entity;

import com.chat.domain.base.entity.Entity;
import com.chat.domain.group.member.enums.IdentityType;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.validation.annotation.Validated;

import java.io.Serial;

/**
 * (SysGroupMember)表实体类
 *
 * @author makejava
 * @since 2024-04-09 10:04:10
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SysGroupMember extends Entity {
    /**
     * 同意
     */
    public static final int AGREE = 1;
    /**
     * 拒绝
     */
    public static final int REFUSE = 0;
    /**
     * 群主审核
     */
    public static final int WAITING = -1;

    @Serial
    private static final long serialVersionUID = 2061803792636721549L;

    //群ID
    @JsonView({Entity.INSERT.class})
    @NotBlank(message = "群ID不能为空",groups = INSERT.class)
    private String groupId;

    //用户
    @JsonView({Entity.INSERT.class,SaveOrUpdate.class})
    @NotBlank(message = "用户ID不能为空",groups = {INSERT.class,SaveOrUpdate.class})
    private String userId;

    //身份{成员|群主}
    @JsonView(IGNORE.class)
    private IdentityType identity;

    //状态 1 同意入群 0 不同意入群 -1 审核中
    @JsonView(IGNORE.class)
    private Integer state;

    public static SysGroupMember create(String groupId, String userId, IdentityType identity, Integer state) {
        SysGroupMember member = new SysGroupMember();
        member.setGroupId(groupId);
        member.setUserId(userId);
        member.setIdentity(identity);
        member.setState(state);
        return member;
    }
}

