package com.chat.domain.common.response;

import com.chat.domain.group.information.entity.SysGroupInformation;
import com.chat.domain.user.entity.SysUser;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
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

    private List<SysUser> users;

    private List<SysGroupInformation> groups;

    private List<SysUser> friends;

}
