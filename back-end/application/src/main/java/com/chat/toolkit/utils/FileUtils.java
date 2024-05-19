package com.chat.toolkit.utils;

import cn.hutool.core.io.FileMagicNumber;
import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.*;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;


/**
 * 通用文件工具类
 * @author xxl
 * @since 2023/11/23
 */
public class FileUtils {

    /**
     * 上传
     *
     * @param file     文件
     * @param savePath 保存路径
     * @return 字符串
     * @throws RuntimeException 使用
     */
    public static String upload(InputStream file, String savePath) {
        if (ObjectUtil.isNull(file) || StrUtil.isBlank(savePath)) {
            return null;
        }
        File touch = null;
        BufferedOutputStream writer = null;
        try {
            //路径不存就创建
            touch = FileUtil.touch(new File(savePath));
            writer = new BufferedOutputStream(new FileOutputStream(touch));
            file.transferTo(writer);
            file.close();
        } catch (Exception e) {
            throw new RuntimeException("FileUtils：文件写出失败," + e.getMessage());
        }finally {
            if (!Objects.isNull(writer)) {
                try {
                    writer.close();
                } catch (Exception e) {
                    throw new RuntimeException("FileUtils：文件写出失败," + e.getMessage());
                }
            }
        }
        return touch.getPath();
    }

    /**
     * 下载
     *
     * @param filePath 文件路径
     * @return 字节[]
     * @throws RuntimeException 使用
     */
    public static byte[] download(String filePath){
        //路径不存就创建
        File touch = FileUtil.touch(new File(filePath));
        if (!touch.exists()) {
            throw new RuntimeException(String.format("%s不存在",filePath));
        }
        try (BufferedInputStream inputStream = new BufferedInputStream(new FileInputStream(touch))){
            return inputStream.readAllBytes();
        } catch (Exception e) {
            throw new RuntimeException("FileUtils：文件读入失败," + e.getMessage());
        }
    }

    /**
     * 网页下载
     *
     * @param filePath 文件路径
     * @param response 响应
     * @param fileName 文件名
     * @throws RuntimeException 使用
     */
    public static void webDownload(String filePath, HttpServletResponse response,String fileName) throws RuntimeException {
        try {
            byte[] download = download(filePath);
            response.setHeader("Content-Disposition", "attachment;filename=" + URLUtil.encode(fileName));
            response.addHeader("Content-Length", "" + download.length);
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
            response.setContentType("application/octet-stream;charset=UTF-8");
            IoUtil.write(response.getOutputStream(), true, download);
        } catch (Exception  e) {
            throw new RuntimeException("WEB下载失败," + e.getMessage());
        }
    }

    public static void webDownload(byte[] fileBytes,HttpServletResponse response,String fileName) throws RuntimeException {
        try {
            response.setHeader("Content-Disposition", "attachment;filename=" + URLUtil.encode(fileName));
            response.addHeader("Content-Length", "" + fileBytes.length);
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
            response.setContentType("application/octet-stream;charset=UTF-8");
            IoUtil.write(response.getOutputStream(), true, fileBytes);
        } catch (Exception  e) {
            throw new RuntimeException("WEB下载失败," + e.getMessage());
        }
    }


    /**
     * 获取文件后缀
     *
     * @param path 路径
     * @return 字符串
     */
    public static String getFileSuffix(String path){
        final String dot = ".";
        Assert.isTrue(!StrUtil.isBlank(path) && path.contains(dot),"文件后缀名不合法");
        return path.substring(path.lastIndexOf(dot) + 1);
    }

    /**
     * 获取文件名
     *
     * @param path 路径
     * @return 字符串
     */
    public static String getFileName(String path) {
        Assert.isTrue(!StrUtil.isBlank(path),"文件名不能为空");
        //解决linux系统和windows系统存储路径不一样
        int indexOf ;
        if ((indexOf = path.lastIndexOf("\\")) != -1) {
            return path.substring(indexOf + 1);
        }else if ((indexOf = path.lastIndexOf("/")) != -1) {
            return path.substring(indexOf + 1);
        }else {
            throw new RuntimeException("文件名获取失败");
        }
    }

    /**
     *  获取完整的URL
     * @param request 请求
     * @param requestPath 请求path
     * @return path
     */
    public static String getUrl(HttpServletRequest request,String requestPath) {
        // 获取协议（如http或https）
        String scheme = request.getScheme();
        // 获取服务器名称（如localhost或具体域名）
        String serverName = request.getServerName();
        // 获取服务器端口号
        int serverPort = request.getServerPort();
        // 获取请求URI（如/endpoint）
        String requestUri = request.getRequestURI();
        // 组合成完整的请求URL
        return scheme + "://" + serverName + ":" + serverPort + requestPath;
    }

    /**
     * 检查文件后缀是否满足条件
     * @param fileName 文件名
     * @param type 校验类型
     */
    public static void checkFileSuffix(String fileName, FileMagicNumber...type)  {
        checkFileSuffix(fileName, Arrays.stream(type).map(FileMagicNumber::getExtension).toList());
    }

    public static void checkFileSuffix(String fileName, List<String> fulfilSuffix)  {
        boolean match = fulfilSuffix.parallelStream().anyMatch(t -> t.equalsIgnoreCase(FileUtils.getFileSuffix(fileName)));
        Assert.isTrue(match,"不支持的文件格式 = "+ FileUtils.getFileSuffix(fileName));
    }
}
