package com.chat.domain.chat.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chat.domain.base.service.AbstractService;
import com.chat.domain.chat.entity.MsgContent;
import com.chat.domain.chat.entity.SysChatInformation;
import com.chat.domain.chat.mapper.SysChatInformationDao;
import com.chat.domain.friend.entity.SysFriend;
import com.chat.domain.friend.service.FriendService;
import com.chat.domain.group.information.entity.SysGroupInformation;
import com.chat.domain.group.information.service.GroupInformationService;
import com.chat.domain.user.entity.SysUser;
import com.chat.domain.user.service.UserService;
import com.chat.toolkit.utils.CommonPageRequestUtils;
import com.common.util.AssertUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

/**
 * @author xxl
 * @since 2024/4/9
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatInformationService extends AbstractService<SysChatInformationDao, SysChatInformation> {

    private final UserService userService;

    private final FriendService friendService;

    private final GroupInformationService groupInformationService;

    public Page<SysChatInformation> getChatInformationByRoomId(String roomId) {
        //优化查询熟读对象缓存池
        final Map<String, SysUser> cachePool = new HashMap<>();
        Page<SysChatInformation> page = this.lambdaQuery().eq(SysChatInformation::getRoomId, roomId).page(CommonPageRequestUtils.defaultPage());

        page.getRecords().forEach(t -> {
            String sendUserId = t.getSendUserId();

            if (cachePool.containsKey(sendUserId)) {
                //如果存在则从对象池中取
                t.setUser(cachePool.get(sendUserId));
                return;
            }

            //不在则从数据库中取
            SysUser user = userService.getById(sendUserId, false);
            cachePool.putIfAbsent(sendUserId,user);
            t.setUser(user);
        });

        return page;
    }

    public Boolean saveInfo(MsgContent context) {
        String roomId = context.getRoomId();

        AssertUtils.assertTrue(
                (roomId.length() > 20 && friendService.lambdaQuery().eq(SysFriend::getChatId,roomId).exists())
                        ||
                        (roomId.length() < 20 && groupInformationService.doIsInGroup(roomId,context.getUserId()))
                ,"聊天对象不存在");

        Integer latestNumber = findLatestNumber(roomId);
        SysChatInformation information = SysChatInformation.create(latestNumber, roomId, context.getUserId(), context.getText(), context.getMsgType());
        return this.save(information);
    }

    /**
     *  查询最后一个序号
     */
    private Integer findLatestNumber(String roomId) {
        //解决查询集合查询
        Page<SysChatInformation> page = new Page<>();
        page.setCurrent(1);
        page.setSize(1);
        page = this.lambdaQuery().eq(SysChatInformation::getRoomId, roomId).orderByDesc(SysChatInformation::getSerialNumber).page(page);
        //查询房间号为空则为初始序号
        return page.getRecords().isEmpty() ? 0 : page.getRecords().get(0).getSerialNumber() + 1;
    }
}
