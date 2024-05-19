package com.chat.domain.file.service;

import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.json.JSON;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.chat.domain.base.AbstractService;
import com.chat.domain.file.entity.SysFile;
import com.chat.domain.file.mapper.SysFileDao;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@Slf4j
public class FileService extends AbstractService<SysFileDao, SysFile> {

    @Value("${file.upload.url}")
    private String uploadUrl;

    @Value("${file.download.url}")
    private String downloadUrl;

    @Value("${file.signature}")
    private String  signature;

    @Value("${file.cipher-text}")
    private String cipherText;

    private final HttpServletRequest request;

    private final HttpServletResponse response;

    public void download(String downloadId) {
        HttpResponse httpResponse = HttpRequest.
                get(downloadUrl + "/" + downloadId).
                addHeaders(Map.of("signature", signature, "cipherText", cipherText)).
                executeAsync();
        log.warn("httpResponse = {}",httpResponse);
    }

    public String upload(MultipartFile file) {
        try {
            HttpResponse httpResponse = HttpRequest.post(uploadUrl).
                    addHeaders(Map.of("signature", signature, "cipherText", cipherText)).
                    form("file",file.getBytes(),file.getOriginalFilename()).
                    executeAsync();
            log.warn("httpResponse = {}",httpResponse);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
        return null;
    }
}
