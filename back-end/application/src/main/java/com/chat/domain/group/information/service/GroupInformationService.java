package com.chat.domain.group.information.service;

import com.chat.domain.base.AbstractService;
import com.chat.domain.group.announcement.entity.SysGroupAnnouncement;
import com.chat.domain.group.announcement.service.GroupAnnouncementService;
import com.chat.domain.group.information.entity.SysGroupInformation;
import com.chat.domain.group.information.enums.GetType;
import com.chat.domain.group.information.mapper.SysGroupInformationDao;
import com.chat.domain.group.member.entity.SysGroupMember;
import com.chat.domain.group.member.enums.IdentityType;
import com.chat.domain.group.member.service.GroupMemberService;
import com.common.exception.ChatException;
import com.common.util.AssertUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
@RequiredArgsConstructor
public class GroupInformationService extends AbstractService<SysGroupInformationDao, SysGroupInformation>  {

    private final GroupAnnouncementService announcementService;

    private final GroupMemberService memberService;

    public  Boolean doCreate(SysGroupInformation information, String userId) {
        information.setCreateUserId(userId);
        //群信息 && 群成员添加
        return this.save(information) && memberService.save(information.getId(), userId, IdentityType.LORD, SysGroupMember.AGREE);
    }

    public Boolean doModify(SysGroupInformation information) {
        SysGroupInformation entity = getById(information.getId());
        entity.setGroupName(information.getGroupName());
        entity.setAvatar(information.getAvatar());
        entity.setCreateUserId(information.getCreateUserId());
        return this.updateById(entity);
    }

    public Boolean doAddMember(SysGroupMember groupMember, String userId) {
        List<SysGroupMember> members = memberService.getMemberByGroupId(groupMember.getGroupId());
        AssertUtils.assertTrue(members.stream().noneMatch(t -> groupMember.getUserId().equals(t.getUserId())),"邀请用户已经在群中,无法重复邀请");
        AssertUtils.assertTrue(members.stream().anyMatch(t -> t.getUserId().equals(userId)),"当前用户不在群中,无法邀请");
        //判断当前用户是否是群主如果是则是拉用户
        boolean isLord = members.parallelStream().anyMatch(t -> IdentityType.LORD.equals(t.getIdentity()) && t.getUserId().equals(userId));

        if (isLord) {
            //是
            groupMember.setState(SysGroupMember.AGREE);
            groupMember.setIdentity(IdentityType.MEMBER);
            return memberService.save(groupMember);
        }

        //不是就是申请入群
        groupMember.setState(SysGroupMember.WAITING);
        groupMember.setIdentity(IdentityType.MEMBER);
        return memberService.save(groupMember);
    }

    public List<SysGroupInformation> search(String keyword) {
        return this.lambdaQuery().
                like(SysGroupInformation::getGroupName, keyword).
                list();
    }

    public List<SysGroupInformation> getMyGroup(String userId, GetType getType) {
        switch (getType) {
            case MY ->
            {
                List<SysGroupInformation> list = this.lambdaQuery().eq(SysGroupInformation::getCreateUserId, userId).list();
                return fillGroupInfo(list);
            }

            case IN -> {
                List<String> groupIds = memberService.
                        getMemberByUserId(userId).
                        stream().
                        //我所在的群且不是群主
                        filter(t -> IdentityType.MEMBER.equals(t.getIdentity())).
                        map(SysGroupMember::getGroupId).
                        toList();

                if (groupIds.isEmpty()) {
                    return Collections.emptyList();
                }

                //获取所有群信息
                List<SysGroupInformation> groups = this.listByIds(groupIds);
                return fillGroupInfo(groups) ;
            }
            default -> throw new ChatException("类型错误");
        }
    }

    public Boolean doDelete(String groupId, String userId) {
        SysGroupInformation group = getMyGroupByGroupId(groupId, userId);
        AssertUtils.notNull(group, "群不存在/你无权删除");
        return this.removeById(groupId);
    }


    public Boolean doDeleteMember(String groupId, String deleteUserId,String loginUserId) {
        SysGroupInformation information = this.getById(groupId);

        //当前用户等于群主 && 登录用户不是删除用户ID 表示是群主删除别人
        if (information.getCreateUserId().equals(loginUserId)) {
            AssertUtils.assertTrue(!loginUserId.equals(deleteUserId),"群主不可删除自己");
            return  memberService.removeByGroupIdAndUserId(groupId, deleteUserId);
        }

        //表示自己退出此时deleteUserId失效
        return memberService.removeByGroupIdAndUserId(groupId, loginUserId);

    }

    public Boolean doAddAnnouncement(SysGroupAnnouncement announcement, String userId) {
        SysGroupInformation information = getMyGroupByGroupId(announcement.getGroupId(), userId);
        AssertUtils.notNull(information, "群不存在/你无权添加公告");
        announcement.setUserId(userId);

        //更新top
        this.announcementService.updateTop(announcement.getEnableTop());
        return this.announcementService.save(announcement);
    }


    public Boolean doModifyAnnouncement(SysGroupAnnouncement announcement, String userId) {
        SysGroupAnnouncement groupAnnouncement = announcementService.getById(announcement.getId());
        SysGroupInformation information = getMyGroupByGroupId(groupAnnouncement.getGroupId(), userId);
        AssertUtils.notNull(information, "你无权修改公告");

        //设置更新的值
        groupAnnouncement.setAnnouncement(announcement.getAnnouncement());
        groupAnnouncement.setEnableTop(announcement.getEnableTop());

        // 更新top
        this.announcementService.updateTop(announcement.getEnableTop());
        return this.announcementService.updateById(groupAnnouncement);
    }

    public Boolean doDeleteAnnouncement(String announcementId, String userId) {
        SysGroupAnnouncement groupAnnouncement = announcementService.getById(announcementId);
        SysGroupInformation information = getMyGroupByGroupId(groupAnnouncement.getGroupId(), userId);
        AssertUtils.notNull(information, "你无权删除公告");
        return this.announcementService.removeById(announcementId);
    }

    private List<SysGroupInformation> fillGroupInfo(List<SysGroupInformation> list) {
        return  list.stream().
                peek(t -> {
                    t.setMembers(memberService.getMemberByGroupId(t.getId()));
                    t.setAnnouncements(announcementService.doQueryAnnouncementByGroupId(t.getId()));
                }).
                toList();
    }


    private SysGroupInformation getMyGroupByGroupId(String groupId, String userId) {
        return this.lambdaQuery().eq(SysGroupInformation::getId, groupId).eq(SysGroupInformation::getCreateUserId, userId).one();
    }



}
