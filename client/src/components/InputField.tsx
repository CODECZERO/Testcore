// import React, { FC, InputHTMLAttributes } from 'react';
// import '../styles/InputField.css';

// interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
// }

// const InputField: FC<InputFieldProps> = ({ label, ...props }) => {
//   return (
//     <div className="container">
//       <input className='input' {...props} />
//       {label && <label className="label">{label}</label>}
//     </div>
//   );
// };

// export default InputField;


import { FC, InputHTMLAttributes } from 'react';
import '../styles/InputField.css';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const InputField: FC<InputFieldProps> = ({ label, ...props }) => {
  return (
    <div className="form-control">
      <input className="input" {...props} required />
      {label && (
        <label>
          {label.split('').map((char, index) => (
            <span key={index} style={{ transitionDelay: `${index * 50}ms` }}>
              {char}
            </span>
          ))}
        </label>
      )}
    </div>
  );
};

export default InputField;
