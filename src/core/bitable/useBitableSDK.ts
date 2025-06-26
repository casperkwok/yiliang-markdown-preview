/**
 * @file useBitableSDK.ts
 * @author Peng
 * @date 2025-03-02
 * @version 1.0.0
 * @description 多维表格SDK钩子函数
 */
import { useEffect, useState } from 'react';
import { IBitable } from '../../shared/types';

// 定义SDK类型
type BitableSDK = {
    bitable: IBitable | null;
    loaded: boolean;
    loading: boolean;
    error: Error | null;
};

// 初始状态
const initialState: BitableSDK = {
    bitable: null,
    loaded: false,
    loading: true,
    error: null
};

// 缓存SDK实例
let cachedSDK: IBitable | null = null;
let loadPromise: Promise<IBitable> | null = null;

// 加载SDK的函数
const loadBitableSDK = async (): Promise<IBitable> => {
    // 如果已经有缓存，直接返回
    if (cachedSDK) {
        return cachedSDK;
    }
    
    // 如果已经有加载中的Promise，复用它
    if (loadPromise) {
        return loadPromise;
    }
    
    // 创建新的加载Promise
    loadPromise = import('@lark-base-open/js-sdk')
        .then(module => {
            cachedSDK = module.bitable as IBitable;
            return module.bitable as IBitable;
        })
        .finally(() => {
            // 加载完成后清除Promise引用
            loadPromise = null;
        });
    
    return loadPromise;
};

export const useBitableSDK = () => {
    const [sdk, setSDK] = useState<BitableSDK>(initialState);

    useEffect(() => {
        let isMounted = true;

        const initSDK = async () => {
            try {
                // 使用共享的加载函数
                const bitable = await loadBitableSDK();
                
                if (isMounted) {
                    setSDK({
                        bitable,
                        loaded: true,
                        loading: false,
                        error: null
                    });
                }
            } catch (error) {
                if (isMounted) {
                    setSDK({
                        bitable: null,
                        loaded: false,
                        loading: false,
                        error: error instanceof Error ? error : new Error('Failed to load Bitable SDK')
                    });
                }
            }
        };

        void initSDK();

        return () => {
            isMounted = false;
        };
    }, []);

    return sdk;
};

// 预加载SDK函数
export const preloadBitableSDK = () => {
    if ('requestIdleCallback' in window) {
        window.requestIdleCallback(() => {
            loadBitableSDK()
                .catch(err => console.error('Bitable SDK预加载失败:', err));
        }, { timeout: 2000 });
    } else {
        setTimeout(() => {
            loadBitableSDK()
                .catch(err => console.error('Bitable SDK预加载失败:', err));
        }, 1000);
    }
}; 