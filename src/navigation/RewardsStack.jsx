import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import NamiquiNavHeader from '../components/NamiquiNavHeader';
import RewardsHome from '../components/Rewards/RewardsHome';
import RegisteredGoods from '../components/Rewards/RegisteredGoods';
import EditGood from '../components/Rewards/EditGood';
import LaunchReward from '../components/Rewards/LaunchReward';
import ActiveRewards from '../components/Rewards/ActiveRewards';
import RewardDetail from '../components/Rewards/RewardDetail';
import ActiveAlerts from '../components/Rewards/ActiveAlerts';
import AlertDetail from '../components/Rewards/AlertDetail';
import ClaimReward from '../components/Rewards/ClaimReward';
import VerifyClaim from '../components/Rewards/VerifyClaim';
import ClaimDetail from '../components/Rewards/ClaimDetail';
import GetMoreInfo from '../components/Rewards/GetMoreInfo';

const Stack = createStackNavigator();

export default function RewardsStack() {
  return (
    <Stack.Navigator
      headerMode="screen"
      headerStyle={{ height: 80 }}
      screenOptions={{
        header: ({ scene, previous, navigation }) => <NamiquiNavHeader scene={scene} previous={previous} navigation={navigation} />,
      }}
    >
      <Stack.Screen name="Rewards" component={RewardsHome} options={{ headerShown: false }} />
      <Stack.Screen name="Registered Goods" component={RegisteredGoods} options={{ headerShown: false }} />
      <Stack.Screen name="Edit Good" component={EditGood} options={{ headerShown: false }} />
      <Stack.Screen name="Launch Reward" component={LaunchReward} options={{ headerShown: false }} />
      <Stack.Screen name="Active Rewards" component={ActiveRewards} options={{ headerShown: false }} />
      <Stack.Screen name="Reward Detail" component={RewardDetail} options={{ headerShown: false }} />
      <Stack.Screen name="Active Alerts" component={ActiveAlerts} options={{ headerShown: false }} />
      <Stack.Screen name="Alert Detail" component={AlertDetail} options={{ headerShown: false }} />
      <Stack.Screen name="Claim Reward" component={ClaimReward} options={{ headerShown: false }} />
      <Stack.Screen name="Verify Claim" component={VerifyClaim} options={{ headerShown: false }} />
      <Stack.Screen name="Claim Detail" component={ClaimDetail} options={{headerShown: false}} />
      <Stack.Screen name="Get More Info" component={GetMoreInfo} options={{headerShown: false}} />

    </Stack.Navigator>
  );
}
