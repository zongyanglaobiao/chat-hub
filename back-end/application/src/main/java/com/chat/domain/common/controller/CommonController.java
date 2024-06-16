package com.chat.domain.common.controller;

import com.chat.controller.Controller;
import com.chat.domain.common.request.SearchRequest;
import com.chat.domain.common.response.SearchResponse;
import com.common.resp.RespEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.nio.charset.StandardCharsets;

/**
 * @author xxl
 * @since 2024/4/9
 */
@RestController
@RequestMapping("/common")
@Validated
@Tag(name = "通用接口")
@Slf4j
public class CommonController extends Controller {

    //搜索
    @PostMapping("/doSearch")
    public RespEntity<SearchResponse> doSearch(@RequestBody @Validated SearchRequest request) {
        return RespEntity.success(commonService.doSearch(request));
    }
}
