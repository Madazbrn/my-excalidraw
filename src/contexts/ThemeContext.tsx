import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  actualTheme: 'light' | 'dark'; // 实际应用的主题（解析系统主题后）
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => {
    // 从 localStorage 读取保存的主题设置
    const savedTheme = localStorage.getItem('excalidraw-theme') as Theme;
    return savedTheme || 'system';
  });

  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light');

  // 检测系统主题
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  // 计算实际应用的主题
  const calculateActualTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // 应用主题到 DOM
  const applyTheme = (themeToApply: 'light' | 'dark') => {
    const root = document.documentElement;
    
    if (themeToApply === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    
    setActualTheme(themeToApply);
  };

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('excalidraw-theme', newTheme);
    
    const actualThemeToApply = calculateActualTheme(newTheme);
    applyTheme(actualThemeToApply);
  };

  // 切换主题（在 light 和 dark 之间切换）
  const toggleTheme = () => {
    if (theme === 'system') {
      // 如果当前是系统主题，切换到与当前系统主题相反的主题
      const systemTheme = getSystemTheme();
      setTheme(systemTheme === 'dark' ? 'light' : 'dark');
    } else {
      // 在 light 和 dark 之间切换
      setTheme(theme === 'light' ? 'dark' : 'light');
    }
  };

  // 监听系统主题变化
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const newSystemTheme = getSystemTheme();
        applyTheme(newSystemTheme);
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [theme]);

  // 初始化主题
  useEffect(() => {
    const actualThemeToApply = calculateActualTheme(theme);
    applyTheme(actualThemeToApply);
  }, []);

  const contextValue: ThemeContextType = {
    theme,
    actualTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 主题相关的工具函数
export const getThemeAwareColor = (lightColor: string, darkColor: string, actualTheme: 'light' | 'dark'): string => {
  return actualTheme === 'dark' ? darkColor : lightColor;
};

export const getThemeIcon = (theme: Theme): string => {
  switch (theme) {
    case 'light':
      return '☀️';
    case 'dark':
      return '🌙';
    case 'system':
      return '💻';
    default:
      return '💻';
  }
};

export const getThemeLabel = (theme: Theme): string => {
  switch (theme) {
    case 'light':
      return '浅色模式';
    case 'dark':
      return '深色模式';
    case 'system':
      return '跟随系统';
    default:
      return '跟随系统';
  }
};
