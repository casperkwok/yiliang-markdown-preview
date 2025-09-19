/**
 * @file PDFExportModal.tsx
 * @author Peng
 * @date 2025-09-17
 * @version 1.0.0
 * @description PDF导出设置弹窗组件，支持字段选择和自定义文件名
 */
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX, FiDownload } from "react-icons/fi";
import { Listbox, Transition } from "@headlessui/react";
import {
  ChevronUpDownIcon,
  CheckIcon,
  DocumentTextIcon,
  PencilIcon,
} from "@heroicons/react/20/solid";
import { useTranslation } from "react-i18next";
import { useThemeContext } from "../hooks/useThemeContext";
import { larkBaseService } from "../services/larkBase";

interface PDFExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExport: (filename: string) => Promise<void>;
  fieldName?: string;
  currentIndex?: number;
  recordId?: string;
}

interface FieldOption {
  id: string;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
  type: "custom" | "field";
  fieldId?: string;
}

export const PDFExportModal: React.FC<PDFExportModalProps> = ({
  isOpen,
  onClose,
  onExport,
  fieldName,
  currentIndex = -1,
  recordId,
}) => {
  const { t } = useTranslation();
  const { isDarkMode } = useThemeContext();

  const [selectedOption, setSelectedOption] = useState<string>("custom");
  const [customName, setCustomName] = useState<string>("");
  const [fieldGeneratedName, setFieldGeneratedName] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [_fieldOptions, setFieldOptions] = useState<FieldOption[]>([]);
  const [loadingFields, setLoadingFields] = useState(false);
  const [_selectedFieldValue, setSelectedFieldValue] = useState<string>("");
  const [loadingFieldValue, setLoadingFieldValue] = useState(false);
  const [selectOptions, setSelectOptions] = useState<SelectOption[]>([]);

  // 记忆用户选择的字段（使用localStorage）
  const STORAGE_KEY = "pdf-export-selected-field";

  const saveSelectedField = (fieldName: string) => {
    if (fieldName !== "custom") {
      localStorage.setItem(STORAGE_KEY, fieldName);
    }
  };

  const getStoredField = (): string => {
    return localStorage.getItem(STORAGE_KEY) || "custom";
  };

  // 加载字段列表和生成默认自定义名称
  useEffect(() => {
    if (isOpen) {
      // 生成默认自定义名称
      const now = new Date();
      const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
      const defaultName =
        fieldName && currentIndex >= 0
          ? `${fieldName}_${currentIndex + 1}_${dateStr}`
          : `markdown-preview_${dateStr}`;
      setCustomName(defaultName);

      // 加载字段列表
      const loadFields = async () => {
        try {
          setLoadingFields(true);
          const fields = await larkBaseService.getVisibleFields();
          setFieldOptions(fields);

          // 构建选择选项
          const options: SelectOption[] = [
            {
              value: "custom",
              label: t("pdfExport.customName"),
              type: "custom",
            },
            ...fields.map((field) => ({
              value: field.name,
              label: field.name,
              type: "field" as const,
              fieldId: field.id,
            })),
          ];
          setSelectOptions(options);

          // 恢复用户上次选择的字段
          const storedField = getStoredField();
          const isStoredFieldAvailable = fields.some(
            (f) => f.name === storedField
          );
          const initialSelection = isStoredFieldAvailable
            ? storedField
            : "custom";
          setSelectedOption(initialSelection);

          // 如果选择的是字段，获取其值并生成文件名
          if (initialSelection !== "custom" && recordId) {
            const selectedField = fields.find(
              (f) => f.name === initialSelection
            );
            if (selectedField) {
              const value = await getFieldValue(selectedField.id);
              setSelectedFieldValue(value);
              // 生成字段文件名
              const rawValue = value || initialSelection || "document";
              const cleanFilename = sanitizeFilename(rawValue, 30);
              const indexSuffix =
                currentIndex >= 0 ? `_${currentIndex + 1}` : "";
              const now = new Date();
              const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
              setFieldGeneratedName(
                `${cleanFilename}${indexSuffix}_${dateStr}`
              );
            }
          }
        } catch (error) {
          console.error("Failed to load fields:", error);
          // 如果加载失败，只显示自定义选项
          const fallbackOptions: SelectOption[] = [
            {
              value: "custom",
              label: t("pdfExport.customName"),
              type: "custom",
            },
          ];
          if (fieldName) {
            fallbackOptions.push({
              value: fieldName,
              label: fieldName,
              type: "field",
              fieldId: "current",
            });
          }
          setSelectOptions(fallbackOptions);
          setSelectedOption("custom");
        } finally {
          setLoadingFields(false);
        }
      };

      loadFields();
    }
  }, [isOpen, fieldName, currentIndex, recordId]);

  // 获取选中字段的值
  const getFieldValue = async (fieldId: string) => {
    if (!recordId) return "";
    try {
      setLoadingFieldValue(true);
      const value = await larkBaseService.getCellContent(fieldId, recordId);
      return value || "";
    } catch (error) {
      console.error("Failed to get field value:", error);
      return "";
    } finally {
      setLoadingFieldValue(false);
    }
  };

  // 处理选择变化
  const handleOptionChange = async (optionValue: string) => {
    setSelectedOption(optionValue);
    saveSelectedField(optionValue);

    // 如果选择的是字段，获取其值并生成文件名
    if (optionValue !== "custom") {
      const option = selectOptions.find((opt) => opt.value === optionValue);
      if (option && option.fieldId && recordId) {
        const value = await getFieldValue(option.fieldId);
        setSelectedFieldValue(value);
        // 生成字段文件名
        const rawValue = value || optionValue || "document";
        const cleanFilename = sanitizeFilename(rawValue, 30);
        const indexSuffix = currentIndex >= 0 ? `_${currentIndex + 1}` : "";
        const now = new Date();
        const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
        setFieldGeneratedName(`${cleanFilename}${indexSuffix}_${dateStr}`);
      }
    } else {
      setSelectedFieldValue("");
      setFieldGeneratedName("");
    }
  };

  // 截断长文本并清理文件名
  const sanitizeFilename = (text: string, maxLength: number = 30) => {
    // 移除换行符和多余空格
    const cleaned = text
      .replace(/[\r\n]+/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // 截断文本
    const truncated =
      cleaned.length > maxLength
        ? cleaned.substring(0, maxLength) + "..."
        : cleaned;
    // 移除不安全字符
    return truncated.replace(/[<>:"/\\|?*]/g, "_");
  };

  // 处理导出
  const handleExport = async () => {
    if (isExporting) return;

    let filename = "";

    if (selectedOption === "custom") {
      filename = customName.trim();
    } else {
      filename = fieldGeneratedName.trim();
    }

    // 确保文件名不为空
    if (!filename) {
      filename = "markdown-preview";
    }

    // 确保文件名以.pdf结尾
    if (!filename.endsWith(".pdf")) {
      filename += ".pdf";
    }

    try {
      setIsExporting(true);
      await onExport(filename);
      onClose();
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && !isExporting) {
      handleExport();
    }
  };

  if (!isOpen) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      <div
        className={`w-80 rounded-lg shadow-xl ${
          isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 头部 */}
        <div
          className={`flex items-center justify-between p-4 border-b ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <div className="flex items-center">
            <FiDownload className="w-4 h-4 mr-2 text-indigo-500" />
            <h3 className="font-medium">{t("pdfExport.title")}</h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-gray-100 ${
              isDarkMode ? "hover:bg-gray-700" : ""
            }`}
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>

        {/* 内容 */}
        <div className="p-4 space-y-4">
          {/* 文件名选择 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {t("pdfExport.nameSource")}
            </label>
            <Listbox
              value={selectedOption}
              onChange={handleOptionChange}
              disabled={loadingFields}
            >
              <div className="relative">
                <Listbox.Button
                  className={`relative w-full cursor-default rounded-lg py-2 pl-3 pr-10 text-left shadow-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm ${
                    isDarkMode
                      ? "bg-gray-700 border-gray-600 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  } ${loadingFields ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center">
                    {!loadingFields && (
                      <span className="mr-2 flex-shrink-0 text-gray-400">
                        {selectOptions.find(
                          (opt) => opt.value === selectedOption
                        )?.type === "custom" ? (
                          <PencilIcon className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <DocumentTextIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    )}
                    <span className="block truncate">
                      {loadingFields
                        ? t("pdfExport.loadingFields")
                        : selectOptions.find(
                            (opt) => opt.value === selectedOption
                          )?.label || t("pdfExport.customName")}
                    </span>
                  </div>
                  <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon
                      className={`h-5 w-5 ${
                        isDarkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                      aria-hidden="true"
                    />
                  </span>
                </Listbox.Button>

                <Transition
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <Listbox.Options
                    className={`absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none ${
                      isDarkMode
                        ? "bg-gray-700 border-gray-600"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {!loadingFields &&
                      selectOptions.map((option) => (
                        <Listbox.Option
                          key={option.value}
                          className={({ active }) =>
                            `relative cursor-default select-none py-2.5 pl-10 pr-4 ${
                              active
                                ? isDarkMode
                                  ? "bg-gray-600 text-white"
                                  : "bg-indigo-100 text-indigo-900"
                                : isDarkMode
                                ? "text-gray-200"
                                : "text-gray-900"
                            }`
                          }
                          value={option.value}
                        >
                          {({ selected, active }) => (
                            <>
                              <div className="flex items-center">
                                <span
                                  className={`mr-3 flex-shrink-0 ${
                                    active
                                      ? isDarkMode
                                        ? "text-white"
                                        : "text-indigo-600"
                                      : isDarkMode
                                      ? "text-gray-400"
                                      : "text-gray-400"
                                  }`}
                                >
                                  {option.type === "custom" ? (
                                    <PencilIcon
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  ) : (
                                    <DocumentTextIcon
                                      className="h-4 w-4"
                                      aria-hidden="true"
                                    />
                                  )}
                                </span>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {option.label}
                                </span>
                              </div>
                              {selected ? (
                                <span
                                  className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                    isDarkMode
                                      ? "text-indigo-400"
                                      : "text-indigo-600"
                                  }`}
                                >
                                  <CheckIcon
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                  />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                  </Listbox.Options>
                </Transition>
              </div>
            </Listbox>
          </div>

          {/* 统一的文件名输入 */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              {selectedOption === "custom"
                ? t("pdfExport.customFileName")
                : t("pdfExport.generatedFileName")}
            </label>
            <div className="relative">
              <input
                type="text"
                value={
                  selectedOption === "custom" ? customName : fieldGeneratedName
                }
                onChange={(e) => {
                  if (selectedOption === "custom") {
                    setCustomName(e.target.value);
                  } else {
                    setFieldGeneratedName(e.target.value);
                  }
                }}
                placeholder={
                  selectedOption === "custom"
                    ? t("pdfExport.customNamePlaceholder")
                    : t("pdfExport.generatedFromField")
                }
                disabled={loadingFieldValue}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                  isDarkMode
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                } ${loadingFieldValue ? "opacity-75 cursor-not-allowed" : ""}`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span
                  className={`text-xs ${
                    isDarkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  .pdf
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 底部按钮 */}
        <div
          className={`flex justify-end space-x-2 p-4 border-t ${
            isDarkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          <button
            onClick={onClose}
            disabled={isExporting}
            className={`px-3 py-1.5 text-sm rounded transition-colors ${
              isDarkMode
                ? "text-gray-300 hover:bg-gray-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {t("pdfExport.cancel")}
          </button>
          <button
            onClick={handleExport}
            disabled={
              isExporting ||
              loadingFields ||
              loadingFieldValue ||
              (selectedOption === "custom" && !customName.trim()) ||
              (selectedOption !== "custom" && !fieldGeneratedName.trim())
            }
            className={`px-3 py-1.5 text-sm text-white rounded transition-colors flex items-center ${
              isExporting ||
              loadingFields ||
              loadingFieldValue ||
              (selectedOption === "custom" && !customName.trim()) ||
              (selectedOption !== "custom" && !fieldGeneratedName.trim())
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {isExporting ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1.5"></div>
                {t("pdfExport.exporting")}
              </>
            ) : (
              <>
                <FiDownload className="w-3 h-3 mr-1.5" />
                {t("pdfExport.export")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
