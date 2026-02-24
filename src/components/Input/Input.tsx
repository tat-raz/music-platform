import { FC } from "react";
import style from './Input.module.scss';


interface Props {
    type: string;
    placeholder: string;
    name: string;
    value: string;
    handleChange: (value1: string) => void;
}

export const Input: FC<Props> = ({ type, placeholder, name, value, handleChange }) => {
    return (
        <div className={style.Input}>
            <input
                className={style.inputLabel}
                type={type}            
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(event): void => {                
                    handleChange(event.target.value);
                }}     
            />
        </div>
    )
}