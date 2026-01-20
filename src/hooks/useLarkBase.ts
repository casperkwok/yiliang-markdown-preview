/**
 * @file useLarkBase.ts
 * @author CK
 * @date 2025-07-13
 * @version 1.0.0
 * @description 飞书多维表格操作钩子函数
 */

import { useCallback, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { larkBaseService } from '@/services/larkBase';

// 选择状态类型
interface SelectionState {
    fieldId?: string;
    recordId?: string;
    content: string;
    fieldName: string;
}

export const useLarkBase = () => {
    const { t } = useTranslation();
    const [selection, setSelection] = useState<SelectionState>({
        fieldId: undefined,
        recordId: undefined,
        content: '',
        fieldName: t('common.selectCellPlaceholder')
    });
    const [recordIds, setRecordIds] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(-1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    // Update fieldName when language changes
    useEffect(() => {
        setSelection(prev => ({
            ...prev,
            fieldName: prev.fieldId ? prev.fieldName : t('common.selectCellPlaceholder')
        }));
    }, [t]);

    // 使用ref来存储最新的recordIds，避免依赖问题
    const recordIdsRef = useRef<string[]>([]);
    recordIdsRef.current = recordIds;

    // 获取记录列表
    const getRecordIds = useCallback(async () => {
        try {
            setLoading(true);
            const ids = await larkBaseService.getRecordIds();
            setRecordIds(ids);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error(t('errors.getRecordIds')));
        } finally {
            setLoading(false);
        }
    }, [t]);

    // 获取单元格内容
    const getCellContent = useCallback(async (fieldId: string, recordId: string): Promise<string> => {
        try {
            return await larkBaseService.getCellContent(fieldId, recordId);
        } catch (err) {
            console.error(t('errors.getCellContent'), err);
            return '';
        }
    }, [t]);

    // 更新单元格内容
    const updateCellContent = useCallback(async (content: string): Promise<boolean> => {
        if (!selection.fieldId || !selection.recordId) {
            console.warn(t('errors.noSelectedCell'));
            return false;
        }

        try {
            setLoading(true);
            await larkBaseService.setCellContent(selection.fieldId, selection.recordId, content);

            // 更新本地状态
            setSelection(prev => ({
                ...prev,
                content
            }));

            setError(null);
            return true;
        } catch (err) {
            const error = err instanceof Error ? err : new Error(t('errors.updateCellContent'));
            setError(error);
            console.error(t('errors.updateCellContent'), error);
            return false;
        } finally {
            setLoading(false);
        }
    }, [selection.fieldId, selection.recordId, t]);

    // 获取字段名称
    const getFieldName = useCallback(async (fieldId: string): Promise<string> => {
        try {
            return await larkBaseService.getFieldName(fieldId);
        } catch (err) {
            console.error(t('errors.getFieldName'), err);
            return '';
        }
    }, [t]);

    // 竞态条件控制
    const currentRequestId = useRef(0);

    // 处理选区变化
    const handleSelectionChange = useCallback(async (event: { data: { fieldId: string | null; recordId: string | null } }) => {
        const { fieldId, recordId } = event.data;

        // 如果没有选区，清空状态（但保留 fieldName 占位符）
        if (!fieldId || !recordId) return;

        // 生成新的请求ID，这会立即使之前所有未完成的请求的回调失效
        const reqId = ++currentRequestId.current;

        try {
            // 只有当完全切换了选区时才显示全屏/大 Loading，
            // 如果只是在浏览记录，可以考虑更轻量的 Loading 体验（这里暂时保持现有逻辑）
            setLoading(true);

            // 优化1: 复用 Field Name
            let fieldName = selection.fieldName;
            if (fieldId !== selection.fieldId) {
                fieldName = await getFieldName(fieldId);
            }

            // 检查竞态条件：如果在等待 fieldName 时用户已经切走了，直接丢弃
            if (reqId !== currentRequestId.current) return;

            // 获取内容
            const content = await getCellContent(fieldId, recordId);

            // 检查竞态条件：如果在等待 content 时用户已经切走了（又点击了别的），直接丢弃
            if (reqId !== currentRequestId.current) return;

            // 更新选区状态
            setSelection({
                fieldId,
                recordId,
                content,
                fieldName
            });

            // 更新当前索引 (这个操作开销很小且同步，可以直接做)
            const index = recordIdsRef.current.indexOf(recordId);
            setCurrentIndex(Math.max(index, -1));

            setError(null);
        } catch (err) {
            // 同样需要检查竞态条件，如果是旧请求的错误，忽略它
            if (reqId !== currentRequestId.current) return;

            setError(err instanceof Error ? err : new Error(t('errors.updateCellContent')));
        } finally {
            // 只有当这是最新的请求完成时，才关闭 Loading
            if (reqId === currentRequestId.current) {
                setLoading(false);
            }
        }
    }, [getCellContent, getFieldName, t, selection.fieldId, selection.fieldName]);

    // 导航记录
    const switchRecord = useCallback(async (direction: 'prev' | 'next') => {
        if (!selection.fieldId || recordIdsRef.current.length === 0) return;

        const currentIdx = recordIdsRef.current.indexOf(selection.recordId || '');
        if (currentIdx === -1) return;

        let newIndex: number;
        if (direction === 'prev') {
            newIndex = currentIdx > 0 ? currentIdx - 1 : recordIdsRef.current.length - 1;
        } else {
            newIndex = currentIdx < recordIdsRef.current.length - 1 ? currentIdx + 1 : 0;
        }

        const recordId = recordIdsRef.current[newIndex];
        if (!recordId) return;

        // 使用同一个请求计数器处理竞态
        const reqId = ++currentRequestId.current;

        try {
            setLoading(true);

            // 获取新记录的单元格内容
            const content = await getCellContent(selection.fieldId, recordId);

            // 竞态检查
            if (reqId !== currentRequestId.current) return;

            // 更新选区状态
            setSelection(prev => ({
                ...prev,
                recordId,
                content
            }));
            setCurrentIndex(newIndex);

            setError(null);
        } catch (err) {
            if (reqId !== currentRequestId.current) return;
            setError(err instanceof Error ? err : new Error(t('errors.updateCellContent')));
        } finally {
            if (reqId === currentRequestId.current) {
                setLoading(false);
            }
        }
    }, [selection.fieldId, selection.recordId, getCellContent, t]);

    // 初始化和事件监听
    useEffect(() => {
        // 获取记录列表
        getRecordIds();

        // 监听选区变化
        const unsubscribe = larkBaseService.onSelectionChange(handleSelectionChange);

        return () => {
            unsubscribe();
        };
    }, [getRecordIds, handleSelectionChange]);

    return {
        // 状态
        selection,
        recordIds,
        currentIndex,
        loading,
        error,

        // 方法
        switchRecord,
        getCellContent,
        getFieldName,
        getRecordIds,
        updateCellContent
    };
}; 