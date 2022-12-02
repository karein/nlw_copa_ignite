import { Octicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import { api } from '../services/api';

import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Loading } from '../components/Loading';
import { EmptyPoolList } from '../components/EmptyPoolList';
import { PoolCard, PoolCardsProps } from '../components/PoolCard';

export function Pools() {
  const toast = useToast()
  const navigation = useNavigation();

  const [pools, setPools] = useState<PoolCardsProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchPools() {
    try {
      setIsLoading(true)
      const response = await api.get('/pools');
      setPools(response.data.pools)
      console.log('reponse', response.data.pools)

    } catch (error) {
      console.log(error)

      toast.show({
        title: 'Não foi possível carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })

    } finally {
      setIsLoading(false)
    }
  }

  //useFocusEffect vai executar sempre que a interface receber o foco novamente
  //useCallback garante que a função não seja executada multiplas vezes, garante a performance da função
  useFocusEffect(useCallback(() => {
    fetchPools()
  }, []));

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button
          title="BUSCAR BOLÃO POR CÓDIGO"
          onPress={() => navigation.navigate('find')}
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md" />}
        />

        {
          isLoading ? <Loading /> :
            <FlatList
              px={5}
              data={pools}
              keyExtractor={item => item.id}
              _contentContainerStyle={{ pb: 10 }}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={() => <EmptyPoolList />}
              renderItem={({ item }) => (
                <PoolCard
                  data={item}
                  onPress={() => navigation.navigate('details', { id: item.id })}
                />
              )}
            />
        }

      </VStack>
    </VStack>
  )
}