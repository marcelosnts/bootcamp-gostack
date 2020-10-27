import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import { Form } from '@unform/web';
import { FormHandles } from '@unform/core';

import * as Yup from 'yup';

import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';

import { useToast } from '../../hooks/toast';

import getValidationErrors from '../../utils/getValidationErrors';

import logo from '../../assets/logo.svg';

import Input from '../../components/Input';
import Button from '../../components/Button';

import { Container, Content, Background, AnimationContainer } from './styles';

interface ForgotPasswordFormData {
  email: string;
  password: string;
}

const ForgotPassword: React.FC = () => {
  const formRef = useRef<FormHandles>(null);

  const { addToast } = useToast();

  const handleSubmit = useCallback(
    async (data: ForgotPasswordFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('Email obrigatório!')
            .email('Digite um email válido!'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        // recuperação de senha

        // history.push('/dashboard');
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);

          formRef.current?.setErrors(errors);

          return;
        }

        addToast({
          type: 'error',
          title: 'Erro na recuperação de senha',
          description:
            'Não foi possivel realizar a recuperação de senha. Tente novamente.',
        });
      }
    },
    [addToast],
  );

  return (
    <>
      <Container>
        <Content>
          <AnimationContainer>
            <img src={logo} alt="" />
            <Form ref={formRef} onSubmit={handleSubmit}>
              <h1>Recuperar Senha</h1>

              <Input name="email" icon={FiMail} placeholder="E-mail" />

              <Button type="submit">Recuperar</Button>
            </Form>

            <Link to="/signin">
              <FiLogIn />
              Voltar ao login
            </Link>
          </AnimationContainer>
        </Content>
        <Background />
      </Container>
    </>
  );
};

export default ForgotPassword;
