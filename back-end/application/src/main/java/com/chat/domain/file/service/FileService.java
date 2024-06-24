package com.chat.domain.file.service;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSONUtil;
import com.common.exception.ChatException;
import com.common.log.AsyncLogger;
import com.common.resp.RespEntity;
import com.common.util.AssertUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${file.upload.url}")
    private String uploadUrl;

    @Value("${file.download.url}")
    private String downloadUrl;

    @Value("${file.signature}")
    private String  signature;

    @Value("${file.cipher-text}")
    private String cipherText;

    private final AsyncLogger logger;

    public String upload(MultipartFile file) {
        try (HttpResponse httpResponse = HttpRequest.post(uploadUrl).
                addHeaders(Map.of("signature", signature, "cipherText", cipherText)).
                form("file", file.getBytes(), file.getOriginalFilename()).
                executeAsync()){
            RespEntity resp = JSONUtil.toBean(httpResponse.body(), RespEntity.class);
            logger.warn(this.getClass(),"上传文件: {}",httpResponse.body());
            AssertUtils.assertTrue(resp.getCode() == 200, "上传文件失败: " + resp.getMessage());
            //因为返回的URL所以需要分割
            return (String) resp.getData();
        } catch (IOException e) {
            throw new ChatException("上传文件失败: " + e.getMessage());
        }
    }
}
