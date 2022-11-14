import styles from './input.module.css'

type Props = Readonly<{
    'data-test-id'?: string;
    accept?: string;
    label: string;
    onChange: (files: FileList | null) => void;
}>;

export default function FileInput({
    accept,
    label,
    onChange,
    'data-test-id': dataTestId,
}: Props): JSX.Element {
    return (
        <div className={styles.Input__wrapper}>
            <label className={styles.Input__label}>{label}</label>
            <input
                type="file"
                accept={accept}
                className={styles.Input__input}
                onChange={(e) => onChange(e.target.files)}
                data-test-id={dataTestId}
            />
        </div>
    );
}