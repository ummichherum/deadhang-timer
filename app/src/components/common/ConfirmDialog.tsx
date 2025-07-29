import React from 'react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Bestätigen',
  cancelText = 'Abbrechen',
  onConfirm,
  onCancel,
  variant = 'danger'
}) => {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      backdrop: 'bg-red-50 dark:bg-red-900/20',
      title: 'text-red-800 dark:text-red-200',
      icon: '⚠️',
      confirmBtn: 'bg-red-600 hover:bg-red-700 focus:bg-red-700 text-white'
    },
    warning: {
      backdrop: 'bg-yellow-50 dark:bg-yellow-900/20',
      title: 'text-yellow-800 dark:text-yellow-200',
      icon: '⚠️',
      confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:bg-yellow-700 text-white'
    },
    info: {
      backdrop: 'bg-blue-50 dark:bg-blue-900/20',
      title: 'text-blue-800 dark:text-blue-200',
      icon: 'ℹ️',
      confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:bg-blue-700 text-white'
    }
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      {/* Dialog Container - Mobile Optimized */}
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all">
        {/* Header with Icon */}
        <div className={`p-6 text-center ${styles.backdrop} rounded-t-2xl`}>
          <div className="text-4xl mb-2">{styles.icon}</div>
          <h3 className={`text-lg font-semibold ${styles.title}`}>
            {title}
          </h3>
        </div>

        {/* Message */}
        <div className="px-6 py-4">
          <p className="text-gray-700 dark:text-gray-300 text-center leading-relaxed">
            {message}
          </p>
        </div>

        {/* Action Buttons - Touch Optimized */}
        <div className="flex gap-3 p-6 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 focus:bg-gray-300 dark:focus:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium rounded-xl transition-colors active:scale-95 transform touch-manipulation"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 py-3 px-4 ${styles.confirmBtn} font-medium rounded-xl transition-colors active:scale-95 transform touch-manipulation`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog; 