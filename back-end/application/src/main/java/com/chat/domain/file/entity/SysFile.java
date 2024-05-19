package com.chat.domain.file.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

/**
 * (SysFile)表实体类
 *
 * @author makejava
 * @since 2024-04-08 11:51:39
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SysFile  {

    private MultipartFile file;

}

