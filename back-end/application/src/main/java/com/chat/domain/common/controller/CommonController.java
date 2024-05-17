package com.chat.domain.common.controller;

import com.chat.controller.Controller;
import com.chat.domain.common.request.SearchRequest;
import com.chat.domain.common.service.CommonService;
import com.common.resp.RespEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

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
    @PostMapping("/search")
    public RespEntity<Object> search(SearchRequest request) {
        return RespEntity.success(commonService.search(request));
    }
}
