package com.chat.domain.group.member.service;

import com.chat.domain.base.service.AbstractService;
import com.chat.domain.group.member.entity.SysGroupMember;
import com.chat.domain.group.member.enums.IdentityType;
import com.chat.domain.group.member.mapper.SysGroupMemberDao;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author xxl
 * @since 2024/4/9
 */
@Service
public class GroupMemberService extends AbstractService<SysGroupMemberDao, SysGroupMember> {

    public Boolean save(String groupId, String userId, IdentityType identity,Integer state) {
        return this.save(SysGroupMember.create(groupId, userId, identity,state));
    }

    public List<SysGroupMember> getMemberByGroupId(String groupId) {
        return this.lambdaQuery().eq(SysGroupMember::getGroupId, groupId).list();
    }

    public List<SysGroupMember> getMemberByUserId(String userId) {
        return this.lambdaQuery().eq(SysGroupMember::getUserId, userId).list();
    }

    public SysGroupMember getMemberByGroupIdAndUserId(String groupId, String userId) {
        return this.lambdaQuery().eq(SysGroupMember::getGroupId, groupId).eq(SysGroupMember::getUserId, userId).one();
    }

    public Boolean removeByGroupIdAndUserId(String groupId, String userId) {
        return this.lambdaUpdate().eq(SysGroupMember::getGroupId, groupId).eq(SysGroupMember::getUserId, userId).remove();
    }
}
