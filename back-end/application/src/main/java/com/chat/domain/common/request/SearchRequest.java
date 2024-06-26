package com.chat.domain.common.request;

import com.chat.domain.common.model.SearchType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.io.Serializable;

/**
 * @author xxl
 * @since 2024/5/18
 */
@Data
public class SearchRequest implements Serializable {

    @NotBlank(message = "关键字不能为空")
    private String keyword;

    @NotNull(message = "搜索类型不能为空")
    private SearchType searchType;
}
