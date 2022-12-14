import styles from './ContentEditable.module.css';

import {ContentEditable} from '@lexical/react/LexicalContentEditable';
import * as React from 'react';

export default function LexicalContentEditable({
  className,
}: {
  className?: string;
}): JSX.Element {
  return <ContentEditable className={className || styles.ContentEditable__root} />;
}