import { Heading, Text, VStack, useToast } from "native-base";
import { Header } from "../components/Header";
// import { Alert } from "react-native";
import { useState } from "react";

import { api } from '../services/api';

import Logo from "../assets/logo.svg"

import { Input } from "../components/Input";
import { Button } from "../components/Button";

export function New() {
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handlePoolCreate() {
    if (!title.trim()) {
      // Alert.alert('Novo bolão!', 'Informe um nome pata o seu bolão!')
      return toast.show({
        title: 'Informe um nome pata o seu bolão!',
        placement: 'top',
        bgColor: 'red.500',
      });
    }

    try {
      setIsLoading(true)

      await api.post('/pools', { title })
      // await api.post('/pools', { title: title.toUpperCase() })

      toast.show({
        title: 'Bolão criado com sucesso!',
        placement: 'top',
        bgColor: 'green.500',
      });

      setTitle('')
    } catch (error) {
      console.log(error);

      toast.show({
        title: 'Não foi possível criar o bolão',
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Criar novo bolão" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Logo />

        <Heading fontFamily="heading" color="white" fontSize="xl" my={8} textAlign="center">
          Crie seu pŕoprio bolão da copa {'\n'} e compartilhe entre amigos!
        </Heading>

        <Input
          mb={2}
          value={title}
          onChangeText={setTitle}
          placeholder="Qual o nome do seu bolão?"
        />

        <Button title="CRIAR MEU BOLÃO" onPress={handlePoolCreate} isLoading={isLoading} />

        <Text color="gray.200" fontSize="sm" textAlign="center" px={10} mt={4} >
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas.
        </Text>
      </VStack>
    </VStack>
  )
}