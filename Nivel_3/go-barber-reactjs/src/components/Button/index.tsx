import React, { ButtonHTMLAttributes } from 'react';

import { Container } from './styles';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, ...propsRest }) => (
  <Container type="button" {...propsRest}>
    {children}
  </Container>
);

export default Button;
