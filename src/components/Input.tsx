import { FC } from "react";
import "../styles/input.css";


interface Props {
    type: string;
    placeholder: string;
    name: string;
    value: string;
    handleChange: (value1: string) => void;
    // isError: boolean
}

export const Input: FC<Props> = ({ type, placeholder, name, value, handleChange }) => {
    return (
        <div className="Input">
            <input
                className="input-label"
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