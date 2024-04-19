package com.chat.domain.file.service;

import cn.hutool.http.server.HttpServerRequest;
import com.chat.domain.base.AbstractService;
import com.chat.domain.file.entity.SysFile;
import com.chat.domain.file.mapper.SysFileDao;
import com.chat.toolkit.utils.FileUtils;
import com.common.exception.ChatException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

/**
 * @author xxl
 * @since 2024/4/8
 */
@Service
@RequiredArgsConstructor
public class FileService extends AbstractService<SysFileDao, SysFile> {

    @Value("${file.path}")
    private String path;

    private final HttpServletRequest request;

    private final HttpServletResponse response;

    private static final String REQUEST_URL = "/file/doDownload/";

    public void download(String downloadId) {
        SysFile file = getById(downloadId);
        FileUtils.webDownload(file.getPath(),response,FileUtils.getFileName(file.getPath()));
    }

    public String upload(MultipartFile file) {
        try {
            String savePath = FileUtils.upload(file.getInputStream(), path + file.getOriginalFilename());
            SysFile sysFile = new SysFile();
            sysFile.setPath(savePath);
            this.save(sysFile);
            return FileUtils.getUrl(request,REQUEST_URL + sysFile.getId());
        } catch (IOException e) {
            throw new ChatException("文件上传失败: " + e.getMessage());
        }
    }
}
