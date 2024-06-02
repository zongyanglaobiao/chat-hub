package com.chat.domain.group.information.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chat.domain.base.search.Search;
import com.chat.domain.base.service.AbstractService;
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

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
@RequiredArgsConstructor
public class GroupInformationService extends AbstractService<SysGroupInformationDao, SysGroupInformation> implements Search<String,SysGroupInformation> {

    private final GroupAnnouncementService announcementService;

    private final GroupMemberService memberService;

    public  Boolean doCreate(SysGroupInformation information, String userId) {
        information.setCreateUserId(userId);
        //群信息 && 群成员添加
        return this.save(information) && memberService.save(information.getId(), userId, IdentityType.LORD, SysGroupMember.AGREE);
    }

    public Boolean doModify(SysGroupInformation information, String userId) {
        SysGroupInformation entity = getById(information.getId(),userId,true);
        entity.setGroupName(information.getGroupName());
        entity.setAvatar(information.getAvatar());
        entity.setCreateUserId(information.getCreateUserId());
        return this.updateById(entity);
    }

    public Boolean doAddOrApplyMember(SysGroupMember groupMember, String userId) {
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

    public List<SysGroupInformation> doGetGroup(String userId, GetType getType) {
        switch (getType) {
            case MY -> {
                return fillGroupInfo(this.lambdaQuery().eq(SysGroupInformation::getCreateUserId, userId).list());
            }
            case IN -> {
                //查询群ID
                List<String> groupIds = memberService.
                        getMemberByUserId(userId).
                        stream().
                        //我所在的群且不是群主
                        filter(t -> IdentityType.MEMBER.equals(t.getIdentity())).
                        map(SysGroupMember::getGroupId).
                        toList();
                //获取所有群信息
                return fillGroupInfo(this.listByIds(groupIds)) ;

            }
            case ALL -> {
                List<String> list = memberService.lambdaQuery().eq(SysGroupMember::getUserId, userId).list().stream().map(SysGroupMember::getGroupId).toList();
                return fillGroupInfo(this.listByIds(list));
            }
            default -> throw new ChatException("类型错误");
        }
    }

    public Boolean doIsInGroup(String groupId, String userId) {
        return memberService.lambdaQuery().eq(SysGroupMember::getGroupId, groupId).eq(SysGroupMember::getUserId, userId).exists();
    }

    public Boolean doDelete(String groupId, String userId) {
        SysGroupInformation group = getById(groupId,userId,true);
        return this.removeById(group.getId());
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
        SysGroupInformation information = getById(announcement.getGroupId(), userId,true);
        AssertUtils.notNull(information, "群不存在/你无权添加公告");
        announcement.setUserId(userId);

        //更新top
        this.announcementService.updateTop(announcement.getEnableTop());
        return this.announcementService.save(announcement);
    }


    public Boolean doModifyAnnouncement(SysGroupAnnouncement announcement, String userId) {
        SysGroupAnnouncement groupAnnouncement = announcementService.getById(announcement.getId());
        getById(groupAnnouncement.getGroupId(), userId,true);
        //设置更新的值
        groupAnnouncement.setAnnouncement(announcement.getAnnouncement());
        groupAnnouncement.setEnableTop(announcement.getEnableTop());

        // 更新top
        this.announcementService.updateTop(announcement.getEnableTop());
        return this.announcementService.updateById(groupAnnouncement);
    }

    public Boolean doDeleteAnnouncement(String announcementId, String userId) {
        SysGroupAnnouncement groupAnnouncement = announcementService.getById(announcementId);
        getById(groupAnnouncement.getGroupId(), userId,true);
        return this.announcementService.removeById(announcementId);
    }

    @Override
    public Page<SysGroupInformation> doSearch(String keyword, Page<SysGroupInformation> page) {
        page = this.lambdaQuery().like(SysGroupInformation::getGroupName, keyword).page(page);
        fillGroupInfo(page.getRecords());
        return page;
    }

    private List<SysGroupInformation> fillGroupInfo(List<SysGroupInformation> list) {
        return list.isEmpty() ? new ArrayList<>() :  list.stream().
                peek(t -> {
                    t.setMembers(memberService.getMemberByGroupId(t.getId()));
                    t.setAnnouncements(announcementService.doQueryAnnouncementByGroupId(t.getId()));
                }).
                toList();
    }

    public SysGroupInformation getById(Serializable id,String userId,boolean security) {
        SysGroupInformation information = super.getById(id, false);
        AssertUtils.notNull(information, "群不存在");
        if (security && !information.getCreateUserId().equals(userId)) {
            throw new ChatException("你无权操作");
        }
        return information;
    }
}
