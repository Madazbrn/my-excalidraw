import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

interface EditableTextProps {
  value: string;
  onSave: (newValue: string) => void;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  title?: string;
  disabled?: boolean;
  maxLength?: number;
  onStartEdit?: () => void;
  onCancelEdit?: () => void;
}

export interface EditableTextRef {
  startEdit: () => void;
  cancelEdit: () => void;
  isEditing: boolean;
}

export const EditableText = forwardRef<EditableTextRef, EditableTextProps>(({
  value,
  onSave,
  className = '',
  style,
  placeholder,
  title,
  disabled = false,
  maxLength,
  onStartEdit,
  onCancelEdit,
}, ref) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingValue, setEditingValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    startEdit: () => handleStartEditInternal(),
    cancelEdit: handleCancelEdit,
    isEditing,
  }));

  // 当进入编辑模式时，聚焦输入框并选中文本
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // 当外部 value 变化时，更新内部状态
  useEffect(() => {
    if (!isEditing) {
      setEditingValue(value);
    }
  }, [value, isEditing]);

  const handleStartEditInternal = () => {
    if (disabled) return;
    
    setIsEditing(true);
    setEditingValue(value);
    onStartEdit?.();
  };

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleStartEditInternal();
  };

  const handleSaveEdit = () => {
    const trimmedValue = editingValue.trim();
    if (trimmedValue && trimmedValue !== value) {
      onSave(trimmedValue);
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditingValue(value);
    onCancelEdit?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancelEdit();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!maxLength || newValue.length <= maxLength) {
      setEditingValue(newValue);
    }
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={editingValue}
        onChange={handleInputChange}
        onBlur={handleSaveEdit}
        onKeyDown={handleKeyDown}
        className={`bg-transparent border-b-2 border-excalidraw-purple outline-none ${className}`}
        style={style}
        placeholder={placeholder}
        maxLength={maxLength}
        onClick={(e) => e.stopPropagation()}
      />
    );
  }

  return (
    <span
      className={`cursor-pointer hover:text-excalidraw-purple transition-colors ${
        disabled ? 'cursor-not-allowed opacity-50' : ''
      } ${className}`}
      style={style}
      onClick={handleStartEdit}
      title={title || `${value} (点击编辑)`}
    >
      {value || placeholder}
    </span>
  );
});
