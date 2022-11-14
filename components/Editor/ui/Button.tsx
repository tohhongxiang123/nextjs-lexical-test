import styles from './Button.module.css';

import * as React from 'react';
import { ReactNode } from 'react';

import joinClasses from '../utils/join-classes';

export default function Button({
    'data-test-id': dataTestId,
    children,
    className,
    onClick,
    disabled,
    small,
    title,
}: {
    'data-test-id'?: string;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    onClick: () => void;
    small?: boolean;
    title?: string;
}): JSX.Element {
    return (
        <button
            disabled={disabled}
            className={joinClasses(
                styles.Button__root,
                disabled && styles.Button__disabled,
                small && styles.Button__small,
                className,
            )}
            onClick={onClick}
            title={title}
            aria-label={title}
            {...(dataTestId && { 'data-test-id': dataTestId })}>
            {children}
        </button>
    );
}