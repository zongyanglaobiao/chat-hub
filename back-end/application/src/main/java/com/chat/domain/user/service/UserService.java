package com.chat.domain.user.service;

import com.chat.domain.base.AbstractService;
import com.chat.domain.base.search.Search;
import com.chat.domain.user.entity.SysUser;
import com.chat.domain.user.mapper.SysUserDao;
import com.chat.toolkit.utils.IPUtils;
import com.common.util.AssertUtils;
import com.common.util.JWTUtils;
import com.common.util.MD5Utils;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
@RequiredArgsConstructor
public class UserService extends AbstractService<SysUserDao, SysUser> implements Search<String,List<SysUser>> {

    private final HttpServletRequest request;

    private final IPUtils ipUtils;

    public SysUser doLogin(SysUser sysUser) {
        SysUser user = getUserByMail(sysUser.getMail());
        AssertUtils.notNull(user,"用户不存在");
        AssertUtils.assertTrue(MD5Utils.decrypt(sysUser.getPassword(),user.getPassword()),"密码错误");
        user.setToken(JWTUtils.getToken(user.getId()));
        return user;
    }

    public Boolean doRegister(SysUser sysUser) {
        SysUser userByMail = getUserByMail(sysUser.getMail());
        AssertUtils.isNull(userByMail,"该邮箱已被注册");
        //密码加密
        sysUser.setPassword(MD5Utils.encrypt(sysUser.getPassword()));
        sysUser.setIsOnline(SysUser.UN_ONLINE);
        return this.save(sysUser);
    }

    public Boolean doModify(SysUser sysUser) {
        SysUser user = getById(sysUser.getId());
        AssertUtils.notNull(user,"用户不存在");
        user.setSignature(sysUser.getSignature());
        user.setGender(sysUser.getGender());
        user.setNickname(sysUser.getNickname());
        user.setAvatar(sysUser.getAvatar());
        return this.updateById(user);
    }

    public SysUser doGetInfo(String userId, SysUser user) {

        if (!Objects.isNull(userId)) {
            return getById(userId);
        }

        //如果是查询自己才会设置IP
        user.setIpAddress(ipUtils.getCity(ipUtils.getIp(request)));
        this.updateById(user);
        return  user;
    }

    public List<SysUser> doQueryUserInfos(List<String> userIds) {
        return this.list(SysUser::getId, userIds);
    }

    @Override
    public List<SysUser> doSearch(String keyword) {
        return this.lambdaQuery().
                like(SysUser::getNickname, keyword).
                or().
                like(SysUser::getSignature, keyword).
                or().
                like(SysUser::getMail, keyword).
                list();
    }

    private SysUser getUserByMail(String mail) {
        return this.lambdaQuery().eq(SysUser::getMail, mail).one();
    }
}
