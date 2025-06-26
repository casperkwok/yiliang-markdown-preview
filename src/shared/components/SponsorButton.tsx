import React from 'react';
import { useTranslation } from 'react-i18next';

const SponsorButton: React.FC = () => {
    const { t } = useTranslation();
    
    return (
        <>
            <a 
                href="https://o1ttnutoycv.feishu.cn/docx/Ppe6dlw2hoOktxxa82HcvCtonsc?from=from_copylink"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-indigo-500 text-white font-bold rounded-md hover:bg-indigo-600 transition-colors text-xs flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M9 2a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V6.414A2 2 0 0016.414 5L14 2.586A2 2 0 0012.586 2H9z" />
                    <path d="M3 8a2 2 0 012-2v10h8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                </svg>
                {t('official.doclink')}
            </a>
        </>
    );
};

export default SponsorButton; 