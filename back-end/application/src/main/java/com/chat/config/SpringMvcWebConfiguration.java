package com.chat.config;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import com.chat.domain.user.entity.LoginUser;
import com.common.exception.ChatException;
import com.common.resp.HttpCode;
import com.common.util.JWTUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * mvc配置
 *
 * @author xxl
 * @since 2023/9/16
 */
@ConfigurationProperties(prefix = "authorization")
@Configuration
@RequiredArgsConstructor
@Data
public class SpringMvcWebConfiguration implements HandlerInterceptor, WebMvcConfigurer {

    private static final String PATH = "/**";

    /**
     *  排除的路径
     */
    private String[] exclude;

    /**
     * 是否开启验证,默认为开启
     */
    private boolean enable = true;

    /**
     * token key
     */
    private String tokenName;

    /**
     * 跨域配置
     */
    @Bean
    public CorsFilter corsFilter() {
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        final CorsConfiguration config = new CorsConfiguration();
        config.addAllowedOriginPattern("*");
        config.addAllowedHeader("*");
        // 预检请求的缓存时间（秒），即在这个时间段里，对于相同的跨域请求不会再预检了,这里设置2个小时
        config.setMaxAge(360000L);
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(this).addPathPatterns(PATH).excludePathPatterns(exclude);
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler)  {
        if (!enable) {
            return true;
        }
        String token = StrUtil.isBlank(request.getHeader(tokenName)) ?
                request.getHeader(tokenName.toLowerCase()) :
                request.getHeader(tokenName);
        if (StrUtil.isBlank(token)){
            throw  new ChatException("TOKEN不存在", HttpCode.FORBIDDEN.getCode());
        }
        //保存TOKEN
        LoginUser.store(JWTUtils.verifyToken(token));
        return true;
    }
}
