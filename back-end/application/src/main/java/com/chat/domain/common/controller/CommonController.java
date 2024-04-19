package com.chat.domain.common.controller;

import com.chat.controller.Controller;
import com.chat.domain.common.service.CommonService;
import com.common.resp.RespEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author xxl
 * @since 2024/4/9
 */
@RestController
@RequestMapping("/common")
@Validated
@Tag(name = "通用接口")
public class CommonController extends Controller {


    //搜索
    @GetMapping("/search")
    public RespEntity<Object> search(@RequestParam String keyword) {
        return RespEntity.success(commonService.search(keyword));
    }
}
