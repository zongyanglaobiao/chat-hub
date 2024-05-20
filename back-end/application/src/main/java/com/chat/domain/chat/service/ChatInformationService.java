package com.chat.domain.chat.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chat.domain.base.AbstractService;
import com.chat.domain.chat.entity.MsgContent;
import com.chat.domain.chat.entity.SysChatInformation;
import com.chat.domain.chat.mapper.SysChatInformationDao;
import com.chat.domain.user.service.UserService;
import com.chat.toolkit.utils.CommonPageRequestUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author xxl
 * @since 2024/4/9
 */
@Service
@RequiredArgsConstructor
public class ChatInformationService extends AbstractService<SysChatInformationDao, SysChatInformation> {

    private final UserService userService;

    public Page<SysChatInformation> getChatInformationByRoomId(String roomId) {
        Page<SysChatInformation> page = this.lambdaQuery().eq(SysChatInformation::getRoomId, roomId).page(CommonPageRequestUtils.defaultPage());
        page.getRecords().forEach(t -> {
            t.setUser(userService.getById(t.getSendUserId(),false));
        });
        return page;
    }

    public Boolean saveInfo(MsgContent context) {
        String roomId = context.getRoomId();
        Integer latestNumber = findLatestNumber(roomId);
        SysChatInformation information = SysChatInformation.create(latestNumber, roomId, context.getUserId(), context.getText());
        return this.save(information);
    }

    /**
     *  查询最后一个序号
     */
    private Integer findLatestNumber(String roomId) {
        List<SysChatInformation> list = this.lambdaQuery().eq(SysChatInformation::getRoomId, roomId).orderByDesc(SysChatInformation::getSerialNumber).list();
        //查询房间号为空则为初始序号
        return list.isEmpty() ? 0 : list.get(0).getSerialNumber() + 1;
    }
}
