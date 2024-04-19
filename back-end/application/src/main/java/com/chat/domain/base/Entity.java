package com.chat.domain.base;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.TableField;
import com.fasterxml.jackson.annotation.JsonView;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

/**
 * @author xxl
 * @since 2024/4/1
 */
@Data
public  class Entity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1067285187399247663L;

    @JsonView({UPDATE.class})
    @NotBlank(message = "id不能为空", groups = {UPDATE.class})
    private String id;

    @JsonView({IGNORE.class})
    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @JsonView({IGNORE.class})
    @TableField(fill = FieldFill.UPDATE)
    private Date updateTime;

    public interface INSERT {}

    public interface UPDATE {}

    public interface IGNORE {}
}
