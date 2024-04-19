package com.chat.domain.user.entity;

import com.baomidou.mybatisplus.annotation.TableField;
import com.chat.domain.base.Entity;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.validator.constraints.Length;

import java.io.Serial;

/**
 * (SysUser)表实体类
 *
 * @author makejava
 * @since 2024-04-02 00:15:13
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SysUser extends Entity {

    public static final int ON_LINE = 1;
    public static final int UN_ONLINE = 0;

    @Serial
    private static final long serialVersionUID = 4286768609774846312L;

    @JsonView({Entity.UPDATE.class})
    private String signature;

    @JsonView({Entity.UPDATE.class,REGISTER.class})
    private String gender;

    @JsonView({Entity.UPDATE.class,REGISTER.class})
    private String nickname;

    @JsonView({Entity.INSERT.class,REGISTER.class})
    @Email(message = "邮箱格式错误", groups = {Entity.INSERT.class,REGISTER.class})
    @NotBlank(message = "邮箱不能为空", groups = {Entity.INSERT.class,REGISTER.class})
    private String mail;

    @JsonView({Entity.INSERT.class,REGISTER.class})
    @Length(min = 6, message = "密码不能少于6位", groups = {Entity.INSERT.class,REGISTER.class})
    private String password;

    @JsonView({Entity.IGNORE.class})
    private String ipAddress;

    @JsonView({Entity.UPDATE.class})
    private Integer isOnline;

    @JsonView({Entity.UPDATE.class})
    private String avatar;

    @JsonView({Entity.IGNORE.class})
    @TableField(exist = false)
    private String token;

    public interface REGISTER {

    }
}

