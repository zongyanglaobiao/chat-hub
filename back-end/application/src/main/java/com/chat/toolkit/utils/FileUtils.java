package com.chat.toolkit.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.io.IoUtil;
import cn.hutool.core.util.ObjectUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.core.util.URLUtil;
import com.common.exception.ChatException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.*;


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
     * @throws ChatException 使用
     */
    public static String upload(InputStream file, String savePath) throws ChatException {
        if (ObjectUtil.isNull(file) || StrUtil.isBlank(savePath)) {
            return  null;
        }
        //路径不存就创建
        File touch = FileUtil.touch(new File(savePath));
        try (BufferedOutputStream writer = new BufferedOutputStream(new FileOutputStream(touch))){
            file.transferTo(writer);
            file.close();
        } catch (IOException e) {
            e.printStackTrace();
            throw new ChatException("FileUtils：文件写出失败");
        }
        return touch.getPath();
    }

    /**
     * 下载
     *
     * @param filePath 文件路径
     * @return 字节[]
     * @throws ChatException 使用
     */
    public static byte[] download(String filePath) throws ChatException {
        //路径不存就创建
        File touch = FileUtil.touch(new File(filePath));
        if (!touch.exists()) {
            throw new ChatException(String.format("%s不存在",filePath));
        }
        try (BufferedInputStream inputStream = new BufferedInputStream(new FileInputStream(touch))){
            return inputStream.readAllBytes();
        } catch (IOException e) {
            e.printStackTrace();
            throw new ChatException("FileUtils：文件读入失败");
        }
    }

    /**
     * 网页下载
     *
     * @param filePath 文件路径
     * @param response 响应
     * @param fileName 文件名
     * @throws ChatException 使用
     */
    public static void webDownload(String filePath, HttpServletResponse response,String fileName) throws ChatException {
        try {
            byte[] download = download(filePath);
            response.setHeader("Content-Disposition", "attachment;filename=" + URLUtil.encode(fileName));
            response.addHeader("Content-Length", "" + download.length);
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
            response.setContentType("application/octet-stream;charset=UTF-8");
            IoUtil.write(response.getOutputStream(), true, download);
        } catch (ChatException | IOException e) {
            e.printStackTrace();
            throw new ChatException("web下载失败");
        }
    }

    public static void webDownloadImg(String filePath, HttpServletResponse response,String fileName) throws ChatException {
        try {
            byte[] download = download(filePath);
            // 根据文件扩展名设置正确的Content-Type
            String contentType = getContentType(fileName);
            response.setContentType(contentType);
            response.setHeader("Access-Control-Allow-Origin", "*");
            response.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
            IoUtil.write(response.getOutputStream(), true, download);
        } catch (ChatException | IOException e) {
            e.printStackTrace();
            throw new ChatException("web下载失败");
        }
    }


    private static String getContentType(String fileName) {
        // 这是一个非常简化的例子，你需要根据实际情况来确定文件的MIME类型
        if (fileName.endsWith(".png")) {
            return "image/png";
        } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (fileName.endsWith(".gif")) {
            return "image/gif";
        } else {
            return "application/octet-stream";
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
        if (StrUtil.isBlank(path) || !path.contains(dot)) {
            return null;
        }
        return path.substring(path.lastIndexOf(dot) + 1);
    }

    /**
     * 获取文件名
     *
     * @param path 路径
     * @return 字符串
     */
    public static String getFileName(String path) {
        if (StrUtil.isBlank(path)) {
            return null;
        }
        return path.substring(path.lastIndexOf("\\") + 1);
    }

    /**
     *  获取完整的URL
     * @param request 请求
     * @param requestPath 请求path
     * @return path
     */
    public static String getUrl(HttpServletRequest request, String requestPath) {
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
}
