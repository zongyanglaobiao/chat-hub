package com.chat.domain.file.controller;

import com.chat.controller.Controller;
import com.common.resp.HttpCode;
import com.common.resp.RespEntity;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.constraints.NotNull;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author xxl
 * @since 2024/4/8
 */
@RestController
@RequestMapping("/file")
@Validated
@Tag(name = "文件接口")
public class FileController extends Controller {

    @PostMapping("doUpload")
    public RespEntity<String> doUpload(@RequestPart @NotNull(message = "文件不能为空") MultipartFile file) {
        return  RespEntity.base(HttpCode.SUCCESS.getCode(), HttpCode.SUCCESS.getReasonPhrase(),fileService.upload(file));
    }
}
