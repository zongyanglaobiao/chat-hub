package com.chat.domain.group.announcement.service;

import com.chat.domain.base.AbstractService;
import com.chat.domain.group.announcement.entity.SysGroupAnnouncement;
import com.chat.domain.group.announcement.mapper.SysGroupAnnouncementDao;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
public class GroupAnnouncementService extends AbstractService< SysGroupAnnouncementDao, SysGroupAnnouncement> {

    public List<SysGroupAnnouncement> doQueryAnnouncementByGroupId(String groupId) {
        return this.lambdaQuery().eq(SysGroupAnnouncement::getGroupId, groupId).list();
    }

    public boolean updateTop(int enableTop) {
        if (enableTop == SysGroupAnnouncement.TOP_YES) {
            return  this.lambdaUpdate().eq(SysGroupAnnouncement::getEnableTop, SysGroupAnnouncement.TOP_YES).set(SysGroupAnnouncement::getEnableTop,SysGroupAnnouncement.TOP_NO).update();
        }
        return true;
    }
}
