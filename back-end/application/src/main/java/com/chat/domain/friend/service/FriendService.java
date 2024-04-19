package com.chat.domain.friend.service;

import com.chat.domain.base.AbstractService;
import com.chat.domain.friend.entity.SysFriend;
import com.chat.domain.friend.enums.AgreeType;
import com.chat.domain.friend.mapper.SysFriendDao;
import com.common.exception.ChatException;
import com.common.util.AssertUtils;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
public class FriendService extends AbstractService<SysFriendDao, SysFriend> {

    /**
     * 好友列表
     */
    private static final String FRIEND_LIST = "friendList";

    /**
     * 申请列表
     */
    private static final String APPLICATION_LIST = "applicationList";

    /**
     * 未处理列表
     */
    private static final String UNPROCESSED_LIST = "unprocessedList";



    public Object doQueryFriend(String userId) {
        return Map.of(FRIEND_LIST,
                //朋友列表
                this.lambdaQuery().eq(SysFriend::getUserId, userId).eq(SysFriend::getStatus, SysFriend.STATUS_YES).list(),
                APPLICATION_LIST,
                //所有的申请记录
                this.lambdaQuery().eq(SysFriend::getUserId, userId).eq(SysFriend::getSponsorId, userId).list(),
                UNPROCESSED_LIST,
                //谁申请加我好友待处理
                this.lambdaQuery().eq(SysFriend::getFriendId, userId).eq(SysFriend::getStatus, SysFriend.STATUS_NOT_HANDLER).list());
    }

    public Boolean doAddFriend(String friendId, String userId) {
        AssertUtils.assertTrue(!isMyFriend(userId, friendId),"已经是好友");
        SysFriend sysFriend = new SysFriend();
        sysFriend.setUserId(userId);
        sysFriend.setFriendId(friendId);
        sysFriend.setStatus(SysFriend.STATUS_NOT_HANDLER);
        sysFriend.setSponsorId(userId);
        return this.save(sysFriend);
    }

    public Boolean doYesOrNoAgreeFriend(String id, String userId, AgreeType type) {
        SysFriend friend = this.getById(id);
        AssertUtils.assertTrue(friend.getFriendId().equals(userId),"不是你的好友");
        AssertUtils.assertTrue(friend.getStatus().equals(SysFriend.STATUS_NOT_HANDLER),"已经处理过了");
        switch (type) {
            case AGREE_YES -> {
                friend.setStatus(SysFriend.STATUS_YES);
                this.updateById(friend);
                //互相调换，让被申请人也有这个好友
                friend.setFriendId(friend.getUserId());
                friend.setUserId(userId);
                friend.setCreateTime(null);
                friend.setUpdateTime(null);
                friend.setId(null);
                return  this.save(friend);
            }
            case AGREE_NO -> {
                friend.setStatus(SysFriend.STATUS_NO);
                return this.updateById(friend);
            }
            default -> throw new ChatException("类型错误");
        }
    }

    public Boolean doDeleteFriend(String friendId, String userId) {
        AssertUtils.assertTrue(isMyFriend(userId, friendId),"不是你的好友");
        //从你的列表删除 && 从好友列表删除
        return this.lambdaUpdate().eq(SysFriend::getUserId, userId).eq(SysFriend::getFriendId, friendId).remove()
                && this.lambdaUpdate().eq(SysFriend::getUserId, friendId).eq(SysFriend::getFriendId, userId).remove();
    }

    /**
     *  判断是否是好友
     * @param userId 用户ID
     * @param friendId 好友ID
     * @return 是否是好友
     */
    private boolean isMyFriend(String userId, String friendId) {
        return this.lambdaQuery().
                eq(SysFriend::getUserId, userId).
                eq(SysFriend::getFriendId, friendId).
                eq(SysFriend::getStatus, SysFriend.STATUS_YES).exists();
    }
}
