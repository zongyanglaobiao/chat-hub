package com.chat.domain.friend.service;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.IdUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.chat.domain.base.search.Search;
import com.chat.domain.base.service.AbstractService;
import com.chat.domain.friend.entity.SysFriend;
import com.chat.domain.friend.enums.AgreeType;
import com.chat.domain.friend.mapper.SysFriendDao;
import com.chat.domain.friend.request.SearchFriendRequest;
import com.chat.domain.user.entity.SysUser;
import com.chat.domain.user.service.UserService;
import com.common.exception.ChatException;
import com.common.util.AssertUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
@RequiredArgsConstructor
public class FriendService extends AbstractService<SysFriendDao, SysFriend> implements Search<SearchFriendRequest,SysUser> {

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

    private final UserService userService;

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
                String chatId = IdUtil.simpleUUID();
                friend.setStatus(SysFriend.STATUS_YES);
                //设置聊天ID
                friend.setChatId(chatId);
                this.updateById(friend);
                //互相调换，让被申请人也有这个好友
                friend.setFriendId(friend.getUserId());
                friend.setUserId(userId);
                //设置聊天ID
                friend.setChatId(chatId);
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

    @Override
    public Page<SysUser> doSearch(SearchFriendRequest request, Page<SysUser> page) {
        //这里获取的是系统本机用户ID
        Page<SysFriend> friendPage = new Page<>();
        BeanUtil.copyProperties(page, friendPage);
        //查询我的朋友
        friendPage = this.lambdaQuery().eq(SysFriend::getUserId, request.sysUserId()).page(friendPage);

        //查询朋友的信息
        BeanUtil.copyProperties(friendPage, page);
        List<SysUser> list = friendPage.getRecords().
                stream().
                map(SysFriend::getFriendId).
                map(userService::getById).
                filter(t -> t.getMail().contains(request.keyword()) ||
                        t.getNickname().contains(request.keyword()) ||
                        t.getSignature().contains(request.keyword())).
                toList();
        page.setRecords(list);
        page.setTotal(list.size());
        return page;
    }

    public Boolean doIsMyFriend(String friendId, String userId) {
        return isMyFriend(friendId, userId);
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
