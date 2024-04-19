package com.chat.domain.group.information.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.toolkit.SqlHelper;

import java.io.Serial;

/**
 * @author xxl
 * @since 2024/4/10
 */
public class MyWrapper<T> extends LambdaQueryWrapper<T> {

    @Serial
    private static final long serialVersionUID = -7692490657685785112L;

    public void convert() {

    }
}
