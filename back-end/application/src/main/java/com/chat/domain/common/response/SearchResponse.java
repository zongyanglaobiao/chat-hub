package com.chat.domain.common.response;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chat.domain.group.information.entity.SysGroupInformation;
import com.chat.domain.user.entity.SysUser;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.List;

/**
 * @author xxl
 * @since 2024/5/18
 */
@Data
@Accessors(chain = true)
public class SearchResponse implements Serializable {

    private Page<SysUser> users;

    private Page<SysGroupInformation> groups;

    private Page<SysUser> friends;

}
