import React, { useState } from 'react';
import { useTheme, getThemeIcon, getThemeLabel, type Theme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  variant?: 'button' | 'dropdown';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  variant = 'button', 
  size = 'md',
  className = '' 
}) => {
  const { theme, setTheme, toggleTheme } = useTheme();
  const [showDropdown, setShowDropdown] = useState(false);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  if (variant === 'button') {
    return (
      <button
        onClick={toggleTheme}
        className={`
          btn-ghost rounded-md font-medium transition-all duration-200
          hover:scale-105 active:scale-95
          ${sizeClasses[size]}
          ${className}
        `}
        title={`当前: ${getThemeLabel(theme)} - 点击切换`}
      >
        <span className="mr-1">{getThemeIcon(theme)}</span>
        <span className="hidden sm:inline">{getThemeLabel(theme)}</span>
      </button>
    );
  }

  const themes: Theme[] = ['light', 'dark', 'system'];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`
          btn-ghost rounded-md font-medium transition-all duration-200
          hover:scale-105 active:scale-95 flex items-center gap-1
          ${sizeClasses[size]}
          ${className}
        `}
        title="选择主题"
      >
        <span>{getThemeIcon(theme)}</span>
        <span className="hidden sm:inline">{getThemeLabel(theme)}</span>
        <svg 
          className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showDropdown && (
        <>
          {/* 背景遮罩 */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setShowDropdown(false)}
          />
          
          {/* 下拉菜单 */}
          <div className="absolute right-0 top-full mt-2 z-20 min-w-36 bg-[var(--color-surface-elevated)] border border-[var(--color-border-primary)] rounded-lg shadow-lg py-1">
            {themes.map((themeOption) => (
              <button
                key={themeOption}
                onClick={() => {
                  setTheme(themeOption);
                  setShowDropdown(false);
                }}
                className={`
                  w-full px-3 py-2 text-left text-sm transition-colors duration-150
                  hover:bg-[var(--color-surface-hover)] flex items-center gap-2
                  ${theme === themeOption ? 'bg-[var(--color-surface-active)] text-[var(--color-excalidraw-purple)]' : 'text-[var(--color-text-primary)]'}
                `}
              >
                <span>{getThemeIcon(themeOption)}</span>
                <span>{getThemeLabel(themeOption)}</span>
                {theme === themeOption && (
                  <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

// 简化版主题切换按钮（只有图标）
export const ThemeToggleIcon: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { toggleTheme, theme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full transition-all duration-200
        hover:bg-[var(--color-surface-hover)] hover:scale-110 active:scale-95
        text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]
        ${className}
      `}
      title={`当前: ${getThemeLabel(theme)} - 点击切换`}
    >
      <span className="text-lg">{getThemeIcon(theme)}</span>
    </button>
  );
};
