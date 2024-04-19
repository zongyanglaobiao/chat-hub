package com.chat.domain.file.entity;

import com.chat.domain.base.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * (SysFile)表实体类
 *
 * @author makejava
 * @since 2024-04-08 11:51:39
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class SysFile extends Entity {

    //保存路径
    private String path;

}

