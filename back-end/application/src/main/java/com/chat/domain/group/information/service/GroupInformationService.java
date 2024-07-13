package com.chat.domain.group.information.service;

import cn.hutool.core.util.StrUtil;
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
import org.springframework.transaction.annotation.Transactional;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
@RequiredArgsConstructor
public class GroupInformationService extends AbstractService<SysGroupInformationDao, SysGroupInformation> implements Search<String,SysGroupInformation> {

    private final GroupAnnouncementService announcementService;

    private final GroupMemberService memberService;

    @Transactional(rollbackFor = RuntimeException.class)
    public Boolean doCreateOrModify(SysGroupInformation information, String userId) {
        //todo 创建的的是需要带成员
        SysGroupMember member;
        if (!StrUtil.isBlank(information.getId())) {
            //如果不为空则需要验证修改的用户是否合法
            AssertUtils.notNull((member = memberService.getMemberByGroupIdAndUserId(information.getId(), userId)),"用户不在群组中");
            AssertUtils.assertTrue(Objects.equals(IdentityType.LORD, member.getIdentity()),"只有群主可以修改群信息");
            return this.updateById(information);
        }

        //群信息 && 群成员添加
        information.setCreateUserId(userId);
        //return this.save(information) && memberService.save(information.getId(), userId, IdentityType.LORD, SysGroupMember.AGREE);
        AssertUtils.assertTrue(!information.getMembers().isEmpty(), "群成员不能为空");
        AssertUtils.assertTrue(information.getMembers().stream().anyMatch(t -> Objects.equals(t.getUserId(), userId)), "创建人不存在成员之中");
        return this.save(information) && memberService.saveBatch(information.
                getMembers().
                stream().
                map(t -> Objects.equals(t.getUserId(), userId) ?
                                SysGroupMember.create(information.getId(), t.getUserId(), IdentityType.LORD, SysGroupMember.AGREE)
                                :
                                SysGroupMember.create(information.getId(), t.getUserId(), IdentityType.MEMBER, SysGroupMember.AGREE)
                        ).
                toList());
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
                return groupIds.isEmpty() ? new ArrayList<>() : fillGroupInfo(this.listByIds(groupIds)) ;

            }
            case ALL -> {
                List<String> list = memberService.lambdaQuery().eq(SysGroupMember::getUserId, userId).list().stream().map(SysGroupMember::getGroupId).toList();
                return list.isEmpty() ? new ArrayList<>() : fillGroupInfo(this.listByIds(list));
            }
            default -> throw new ChatException("类型错误");
        }
    }

    public Boolean doIsInGroup(String groupId, String userId) {
        return memberService.lambdaQuery().eq(SysGroupMember::getGroupId, groupId).eq(SysGroupMember::getUserId, userId).exists();
    }

    public Boolean doDelete(String groupId, String userId) {
        SysGroupInformation group = getByIdAndCheck(groupId,userId);
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
        SysGroupInformation information = getByIdAndCheck(announcement.getGroupId(), userId);
        AssertUtils.notNull(information, "群不存在/你无权添加公告");
        announcement.setUserId(userId);

        //更新top
        this.announcementService.updateTop(announcement.getEnableTop());
        return this.announcementService.save(announcement);
    }


    public Boolean doModifyAnnouncement(SysGroupAnnouncement announcement, String userId) {
        SysGroupAnnouncement groupAnnouncement = announcementService.getById(announcement.getId());
        getByIdAndCheck(groupAnnouncement.getGroupId(), userId);
        //设置更新的值
        groupAnnouncement.setAnnouncement(announcement.getAnnouncement());
        groupAnnouncement.setEnableTop(announcement.getEnableTop());

        // 更新top
        this.announcementService.updateTop(announcement.getEnableTop());
        return this.announcementService.updateById(groupAnnouncement);
    }

    public Boolean doDeleteAnnouncement(String announcementId, String userId) {
        SysGroupAnnouncement groupAnnouncement = announcementService.getById(announcementId);
        getByIdAndCheck(groupAnnouncement.getGroupId(), userId);
        return this.announcementService.removeById(announcementId);
    }

    @Override
    public Page<SysGroupInformation> doSearch(String keyword, Page<SysGroupInformation> page) {
        page = this.lambdaQuery().like(SysGroupInformation::getGroupName, keyword).page(page);
        fillGroupInfo(page.getRecords());
        return page;
    }

    public Boolean doAgree(String groupMember, String userId) {
        SysGroupMember groupMemberInfo = memberService.getById(groupMember);
        getByIdAndCheck(groupMemberInfo.getGroupId(),userId);
        groupMemberInfo.setState(SysGroupMember.AGREE);
        return memberService.updateById(groupMemberInfo);
    }

    public boolean doApplyJoinGroup(String groupId, String userId) {
        SysGroupInformation groupInfo = getById(groupId);
        AssertUtils.notNull(groupInfo, "群不存在");
        AssertUtils.assertTrue(!doIsInGroup(groupId, userId), "已经在群里了");
        return memberService.save(groupId, userId, IdentityType.MEMBER, SysGroupMember.WAITING);
    }

    public List<SysGroupInformation> doGetPendingList(String userId) {
        return doGetGroup(userId, GetType.MY).parallelStream().peek(t -> t.setMembers(t.getMembers().parallelStream().filter(t1 -> t1.getState() == SysGroupMember.WAITING).toList())).toList();
    }

    public boolean doMemberInviteJoinGroup(String groupId, String invitees, String invitePeople) {
        SysGroupInformation groupInfo = getById(groupId);
        AssertUtils.notNull(groupInfo, "群不存在");
        AssertUtils.assertTrue(doIsInGroup(groupId, invitePeople), "不在群里不可以邀请人");
        AssertUtils.assertTrue(!doIsInGroup(groupId, invitees), "已经在群里了不可以重复邀请");
        return memberService.lambdaUpdate().eq( SysGroupMember::getGroupId, groupId).eq(SysGroupMember::getUserId, invitePeople).set(SysGroupMember::getState, SysGroupMember.WAITING).update();
    }

    public boolean doLordInviteJoinGroup(String groupId, String invitees, String invitePeople) {
        SysGroupInformation groupInfo = getByIdAndCheck(groupId, invitePeople);
        return memberService.lambdaUpdate().eq(SysGroupMember::getGroupId, groupInfo.getId()).eq(SysGroupMember::getUserId, invitees).set(SysGroupMember::getState, SysGroupMember.AGREE).update();
    }


    /**
     * 填充组信息的成员信息和公告信息
     * @param list  组
     * @return List<SysGroupInformation>
     */
    private List<SysGroupInformation> fillGroupInfo(List<SysGroupInformation> list) {
        return list.isEmpty() ? new ArrayList<>() :  list.stream().
                peek(t -> {
                    t.setMembers(memberService.getMemberByGroupId(t.getId()));
                    t.setAnnouncements(announcementService.doQueryAnnouncementByGroupId(t.getId()));
                }).
                toList();
    }

    /**
     * 带校验的获取组信息
     * @param id id
     * @param userId 用户id
     * @return 组信息
     */
    private SysGroupInformation getByIdAndCheck(Serializable id,String userId) {
        SysGroupInformation information = super.getById(id, false);
        AssertUtils.notNull(information, "群不存在");
        if (!information.getCreateUserId().equals(userId)) {
            throw new ChatException("你无权操作");
        }
        return information;
    }
}
