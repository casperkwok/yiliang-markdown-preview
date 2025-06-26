/**
 * @file useBaseSelection.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 多维表格选择状态管理钩子函数
 */
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { SelectionState, SelectionChangeEvent } from "../../shared/types";
import { useBitableSDK } from "./useBitableSDK";

// 定义富文本节点的接口
interface RichTextNode {
    type: string;
    text?: string;
    // 使用更通用的索引签名，确保包含type和text属性的类型
    [key: string]: unknown;
}

export const useBaseSelection = () => {
    const { t } = useTranslation();
    const { bitable, loaded, loading, error } = useBitableSDK();
    const [selection, setSelection] = useState<SelectionState>({
        fieldId: undefined,
        recordId: undefined,
        content: '',
        fieldName: t('controlBar.output')
    });
    const [recordIds, setRecordIds] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);

    // 获取记录列表
    const getRecordIds = useCallback(async () => {
        if (!loaded || !bitable) return;
        
        try {
            const table = await bitable.base.getActiveTable();
            const view = await table.getActiveView();
            const ids = await view.getVisibleRecordIdList();
            setRecordIds(ids);
        } catch (error) {
            console.error('Error fetching record IDs:', error);
        }
    }, [bitable, loaded]);

    // 解析单元格内容
    const parseCellContent = useCallback((value: unknown): string => {
        // 如果值是字符串，直接返回
        if (typeof value === 'string') {
            return value || '*No content*';
        }
        
        // 如果值是数组，可能是富文本格式
        if (Array.isArray(value)) {
            try {
                // 尝试提取所有文本节点的内容并拼接
                return value.map((item: unknown) => {
                    if (item && typeof item === 'object') {
                        // 使用类型断言确保类型安全
                        const richTextNode = item as RichTextNode;
                        return richTextNode.text || '';
                    }
                    return '';
                }).join('') || '*No content*';
            } catch (e) {
                console.error('Error parsing array content:', e);
            }
        }
        
        // 如果值是对象或其他类型，尝试转换为字符串
        if (value !== null && value !== undefined) {
            try {
                if (typeof value === 'object') {
                    try {
                        // 确保对象被正确转换为JSON字符串
                        const jsonString = JSON.stringify(value, null, 2);
                        return jsonString || '*No content*';
                    } catch (jsonError) {
                        console.error('Error stringifying object:', jsonError);
                        // 如果JSON.stringify失败，尝试提取对象的属性
                        const objProps = Object.entries(value as Record<string, unknown>)
                            .map(([key, val]) => `${key}: ${String(val)}`)
                            .join(', ');
                        return objProps || '*Object conversion failed*';
                    }
                }
                return String(value) || '*No content*';
            } catch (e) {
                console.error('Error converting to string:', e);
            }
        }
        
        return '*No content*';
    }, []);

    // 获取单元格内容
    const getCellContent = useCallback(async (fieldId: string, recordId: string): Promise<string> => {
        if (!loaded || !bitable) return '*No content*';
        
        try {
            const table = await bitable.base.getActiveTable();
            // 使用getCellString方法获取单元格内容
            const cellValue = await table.getCellString(fieldId, recordId);
            
            // 处理不同类型的值
            if (cellValue === null || cellValue === undefined) {
                return '*No content*';
            }
            
            // 先清理掉文本中任何[object Object]
            const cleanedValue = cellValue.replace(/\[object Object\]/g, '');
            
            // 如果返回的是字符串，可能需要进一步解析
            try {
                // 尝试解析JSON，处理返回的可能是JSON字符串的情况
                const parsedValue: unknown = JSON.parse(cleanedValue);
                return parseCellContent(parsedValue);
            } catch (e) {
                // 如果不是有效的JSON，直接返回清理后的字符串内容
                return cleanedValue || '*No content*';
            }
        } catch (error) {
            console.error('Error getting cell content:', error);
            return '*Error: Failed to retrieve content*';
        }
    }, [bitable, loaded, parseCellContent]);

    // 监听单元格内容变化
    const setupCellValueListener = useCallback((fieldId: string, recordId: string): (() => void) | undefined => {
        if (!fieldId || !recordId) return undefined;
        
        // 设置定时器定期检查单元格内容变化
        const checkInterval = window.setInterval(() => {
            // 获取最新内容
            void getCellContent(fieldId, recordId).then(newContent => {
                // 更新内容
                if (newContent && newContent !== selection.content) {
                    setSelection(prev => ({
                        ...prev,
                        content: newContent
                    }));
                }
            }).catch(error => {
                console.error('Error checking cell content:', error);
            });
        }, 500); // 每500毫秒检查一次
        
        // 返回清理函数
        return () => {
            window.clearInterval(checkInterval);
        };
    }, [getCellContent, selection.content]);

    // 处理选区变化
    const handleSelectionChange = useCallback((event: SelectionChangeEvent) => {
        if (!loaded || !bitable) return;
        
        const { fieldId, recordId } = event.data;
        if (!fieldId || !recordId) return;

        // 使用异步函数包装异步操作
        const fetchCellData = async () => {
            try {
                const table = await bitable.base.getActiveTable();
                
                // 获取字段名称
                const field = await table.getFieldById(fieldId);
                const fieldName = await field.getName();
                
                // 获取单元格内容
                const content = await getCellContent(fieldId, recordId);
                
                // 更新选区状态
                setSelection({
                    fieldId,
                    recordId,
                    content,
                    fieldName
                });

                // 更新当前索引
                const index = recordIds.indexOf(recordId);
                setCurrentIndex(Math.max(index, -1));
            } catch (error) {
                console.error('Error fetching cell data:', error);
            }
        };

        // 执行异步操作
        void fetchCellData();
    }, [bitable, loaded, recordIds, getCellContent]);

    // 导航记录
    const switchRecord = useCallback(async (direction: 'prev' | 'next') => {
        if (!loaded || !bitable || !selection.fieldId || recordIds.length === 0) return;

        const currentIndex = recordIds.indexOf(selection.recordId || '');
        if (currentIndex === -1) return;

        let newIndex: number;
        if (direction === 'prev') {
            newIndex = currentIndex > 0 ? currentIndex - 1 : recordIds.length - 1;
        } else {
            newIndex = currentIndex < recordIds.length - 1 ? currentIndex + 1 : 0;
        }

        const recordId = recordIds[newIndex];
        if (!recordId) return;

        try {
            // 获取单元格内容
            const content = await getCellContent(selection.fieldId, recordId);
            
            // 更新选区状态
            setSelection(prev => ({
                ...prev,
                recordId,
                content
            }));
            setCurrentIndex(newIndex);
        } catch (error) {
            console.error('Error switching records:', error);
        }
    }, [bitable, loaded, selection.fieldId, selection.recordId, recordIds, getCellContent]);

    // 初始化
    useEffect(() => {
        if (!loaded || !bitable) return;
        
        void getRecordIds();
        const off = bitable.base.onSelectionChange(handleSelectionChange);
        
        return () => {
            off();
        };
    }, [bitable, loaded, handleSelectionChange, getRecordIds]);

    // 当选中的单元格变化时，设置内容变化监听
    useEffect(() => {
        if (!loaded || !bitable || !selection.fieldId || !selection.recordId) return;
        
        // 设置单元格内容变化监听
        const cleanup = setupCellValueListener(selection.fieldId, selection.recordId);
        
        return cleanup;
    }, [loaded, bitable, selection.fieldId, selection.recordId, setupCellValueListener]);

    return {
        selection,
        recordIds,
        currentIndex,
        switchRecord,
        loading,
        error
    };
}; 