package com.chat.domain.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.chat.domain.user.entity.SysUser;
import org.apache.ibatis.annotations.InsertProvider;

import java.util.List;

/**
 * (SysUser)表数据库访问层
 *
 * @author makejava
 * @since 2024-04-02 00:15:12
 */
public interface SysUserDao extends BaseMapper<SysUser> {
}

