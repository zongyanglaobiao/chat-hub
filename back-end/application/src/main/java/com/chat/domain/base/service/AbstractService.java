package com.chat.domain.base.service;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chat.toolkit.service.IServiceEx;
import com.common.exception.ChatException;
import lombok.val;

import java.io.Serializable;
import java.util.Objects;

/**
 * 抽象类
 *
 * @author xxl
 * @since 2024/3/1
 */
public abstract class AbstractService<M extends BaseMapper<T>,T>  extends ServiceImpl<M,T> implements IServiceEx<T> {

    public T getById(Serializable id,boolean isCheck) {
        val entity = super.getById(id);
        if (isCheck && Objects.isNull(entity)) {
            throw new ChatException("记录不存在");
        }
        return entity;
    }

    @Override
    public T getById(Serializable id) {
        return getById(id,true);
    }
}
