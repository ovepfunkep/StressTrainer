import React from 'react';
import { NavLink } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { BookOpen, BarChart3, Settings } from 'lucide-react';

const Navigation = () => {
  const navItems = [
    {
      to: '/',
      icon: BookOpen,
      label: 'Тренировка',
      description: 'Изучение ударений'
    },
    {
      to: '/stats',
      icon: BarChart3,
      label: 'Статистика',
      description: 'Ваш прогресс'
    },
    {
      to: '/dictionary',
      icon: Settings,
      label: 'Словарь',
      description: 'Управление словами'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:relative md:border-t-0">
      <div className="max-w-4xl mx-auto">
        <nav className="flex justify-around md:justify-center md:space-x-8 p-2 md:p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`
                }
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground hidden md:block">
                  {item.description}
                </span>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;

