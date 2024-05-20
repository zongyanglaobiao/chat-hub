package com.chat.toolkit.utils;

import cn.hutool.core.io.FileUtil;
import cn.hutool.core.lang.Assert;
import cn.hutool.core.util.StrUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.lionsoul.ip2region.xdb.Searcher;

import java.io.File;
import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.function.Function;

import static cn.hutool.core.text.StrPool.DOT;
import static com.baomidou.mybatisplus.core.toolkit.StringPool.EMPTY;

/**
 * 为什么写成单例模式就是因为ip转换省份的数据文件需要动态输入
 * @author xxl
 * @since 2023/11/9
 */
@Slf4j
public class IPUtils {
    /**
     * 过滤本地地址
     */
    public static final String LOOP_BACK_ADDRESS = "0:0:0:0:0:0:0:1";

    /**
     * 前从 xdb 文件中加载出来 VectorIndex 数据，然后全局缓存，
     * 每次创建 Searcher 对象的时候使用全局的 VectorIndex 缓存可以减少一次固定的 IO 操作，
     * 从而加速查询，减少 IO 压力。
     */
    private final byte[] vIndex;
    private final Searcher searcher;

    /**
     * 单例实例
     */
    private static  volatile IPUtils instance;
    private IPUtils(String filePath) {
        try {
            File existFile = FileUtil.file(FileUtil.getTmpDir() + FileUtil.FILE_SEPARATOR + filePath);
            if(!FileUtil.exist(existFile)) {
                InputStream resourceAsStream = IPUtils.class.getResourceAsStream(filePath);
                FileUtil.writeFromStream(resourceAsStream, existFile);
            }

            /**
             * 离线查询IP地址的数据文件地址
             */
            String ipAddressFilePath = existFile.getPath();

            // 从 db 中预先加载 VectorIndex 缓存，并且把这个得到的数据作为全局变量，后续反复使用。
            vIndex = Searcher.loadVectorIndexFromFile(ipAddressFilePath);
            // 使用全局的 vIndex 创建带 VectorIndex 缓存的查询对象。
            searcher = Searcher.newWithVectorIndex(ipAddressFilePath,vIndex);
        } catch (Exception e) {
            throw new RuntimeException("IPUtils class load error", e);
        }
    }

    /**
     * 单例模式
     * @param filePath 数据库存储文件
     * @return 工具实体类
     */
    public static IPUtils getInstance(String filePath) {
        if (instance == null) {
            synchronized (IPUtils.class) {
                if (instance == null) {
                    instance = new IPUtils(filePath);
                }
            }
        }
        return instance;
    }

    /**
     * 每个线程需要单独创建一个独立的 Searcher 对象，但是都共享全局的制度 vIndex 缓存。
     * @param ip IP
     * @return IP地址
     */
    public  String getCity(String ip)  {
        String search = null;
        try {
            search = searcher.search(ip);
        } catch (Exception e) {
            log.error("getCity fail",e);
        }
        return search;
    }
    /**
     * 获取 IP
     *
     * @param request 请求
     * @return 字符串
     */
    public  String getIp(HttpServletRequest request) {
        String ip = null;
        try {
            //解析IP
            ip = new ChainUtils<>(request.getHeader("X-Forwarded-For"))
                //多次反向代理后会有多个ip值，第一个ip才是真实ip
                .chain(re -> StrUtil.isNotBlank(re) ? (re.contains(DOT) ? re.substring(0, re.indexOf(DOT)) : EMPTY) : re)
                //依次查找IP
                .chain(re -> StrUtil.isNotBlank(re) ? re : request.getHeader("X-Real-IP"))
                .chain(re -> StrUtil.isNotBlank(re) ? re : request.getHeader("Proxy-Client-IP"))
                .chain(re -> StrUtil.isNotBlank(re) ? re : request.getHeader("WL-Proxy-Client-IP"))
                .chain(re -> StrUtil.isNotBlank(re) ? re : request.getHeader("HTTP_CLIENT_IP"))
                .chain(re -> StrUtil.isNotBlank(re) ? re : request.getHeader("HTTP_X_FORWARDED_FOR"))
                .chain(re -> StrUtil.isNotBlank(re) ? re : request.getRemoteAddr())
                //过滤本地地址
                .chain(re -> StrUtil.isNotBlank(re) ? (LOOP_BACK_ADDRESS.equals(re) ? getHostAddress()  : re) : re)
                .getValue(true);
        } catch (Exception e) {
            log.error("getIp fail", e);
        }
        return ip;
    }

    /**
     * 获取本地地址
     * @return ip
     */
    public String getHostAddress() {
        String localAddress = null;
        try {
            localAddress = InetAddress.getLocalHost().getHostAddress();
        } catch (UnknownHostException e) {
            log.error("getHostAddress fail", e);
        }
        return localAddress;
    }

    /**
     * @author: xxl
     * @since: 2023/11/9
     * @description: 解决if，else地狱
     */
    @AllArgsConstructor
    public static class ChainUtils<T> {
        /**
         * 存储的值
         */
        private T value;

        public <E> ChainUtils<E> chain(Function<T,E> function) {
            return new ChainUtils<>(function.apply(value));
        }

        /**
         * 获取存储的值
         *
         * @param isNullForException 如果存储的值为null是否抛出异常
         * @return T
         */
        public T getValue(boolean isNullForException) {
            if (isNullForException) {
                Assert.notNull(value, () -> new RuntimeException("chain value is null"));
            }
            return value;
        }
    }
}
