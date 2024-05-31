package com.chat.domain.group.information.controller;

import com.chat.controller.Controller;
import com.chat.domain.base.entity.Entity;
import com.chat.domain.group.announcement.entity.SysGroupAnnouncement;
import com.chat.domain.group.information.entity.SysGroupInformation;
import com.chat.domain.group.information.enums.GetType;
import com.chat.domain.group.member.entity.SysGroupMember;
import com.chat.domain.user.entity.LoginUser;
import com.common.resp.RespEntity;
import com.fasterxml.jackson.annotation.JsonView;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author xxl
 * @since 2024/4/8
 */
@RestController
@RequestMapping("/group")
@Validated
@Tag(name = "群信息接口")
public class GroupInformationController extends Controller {

    //1. 创建群
    @PostMapping("/information/doCreate")
    public RespEntity<Boolean> doCreate(@RequestBody @Validated(Entity.INSERT.class) @JsonView(Entity.INSERT.class) SysGroupInformation information) {
        return RespEntity.success(groupInformationService.doCreate(information, LoginUser.getUserId()));
    }


    //4. 修改群信息/把群主的位置让出去
    @PostMapping("/information/doModify")
    public RespEntity<Boolean> doModify(@RequestBody @Validated(Entity.UPDATE.class) @JsonView(Entity.UPDATE.class) SysGroupInformation information) {
        return RespEntity.success(groupInformationService.doModify(information));
    }

    //查询信息
    @GetMapping("/information/doGetGroup")
    public RespEntity<List<SysGroupInformation>> doGetGroup(@RequestParam GetType getType) {
        return RespEntity.success(groupInformationService.doGetGroup(LoginUser.getUserId(),getType));
    }

    //解散群
    @GetMapping("/information/doDelete")
    public RespEntity<Boolean> doDelete(@RequestParam String groupId) {
        return RespEntity.success(groupInformationService.doDelete(groupId,LoginUser.getUserId()));
    }

    //退出或者删除成员
    @PostMapping("/member/doDeleteOrQuit")
    @Parameter(name = "userId", description = "用户id,需要操作的用户ID可以是自己", required = true)
    @Parameter(name = "groupId", description = "群ID", required = true)
    public RespEntity<Boolean> doDeleteMember(@RequestParam String groupId,@RequestParam String userId) {
        return RespEntity.success(groupInformationService.doDeleteMember(groupId,userId,LoginUser.getUserId()));
    }

    //添加成员/申请
    @PostMapping("/member/doAddMember")
    public RespEntity<Boolean> doAddMember(@RequestBody @Validated(Entity.INSERT.class) @JsonView(Entity.INSERT.class) SysGroupMember groupMember) {
        return RespEntity.success(groupInformationService.doAddMember(groupMember,LoginUser.getUserId()));
    }

    //查看我是否在某个群
    @GetMapping("/member/doIsInGroup")
    public RespEntity<Boolean> doIsInGroup(@RequestParam String groupId) {
        return RespEntity.success(groupInformationService.doIsInGroup(groupId,LoginUser.getUserId()));
    }

    //添加公告
    @PostMapping("/announcement/doAddAnnouncement")
    public RespEntity<Boolean> doAddAnnouncement(@RequestBody @Validated(Entity.INSERT.class) @JsonView(Entity.INSERT.class) SysGroupAnnouncement param) {
        return RespEntity.success(groupInformationService.doAddAnnouncement(param,LoginUser.getUserId()));
    }

    //修改公告
    @PostMapping("/announcement/doModifyAnnouncement")
    public RespEntity<Boolean> doModifyAnnouncement(@RequestBody @Validated(Entity.UPDATE.class) @JsonView(Entity.UPDATE.class) SysGroupAnnouncement announcement) {
        return RespEntity.success(groupInformationService.doModifyAnnouncement(announcement,LoginUser.getUserId()));
    }

    //删除公告
    @GetMapping("/announcement/doDeleteAnnouncement")
    public RespEntity<Boolean> doDeleteAnnouncement(@RequestParam String announcementId) {
        return RespEntity.success(groupInformationService.doDeleteAnnouncement(announcementId,LoginUser.getUserId()));
    }
}
