import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import RainbowButton from '../../components/buttons/RainbowButton';
import Container from '../../components/common/Container';
import Plug from '../../assets/icons/plug-white.png';
import Button from '../../components/buttons/Button';
import { FontStyles } from '../../constants/theme';
import Routes from '../../navigation/Routes';
import styles from './styles';

import { NativeModules } from 'react-native';

const { SigningBridge } = NativeModules;

function Welcome() {
  const navigation = useNavigation();
  const { isInitialized } = useSelector(state => state.keyring);
  const [signedData, setSignedData] = useState('');

  const onPress = flow => () =>
    navigation.navigate(Routes.CREATE_PASSWORD, {
      flow,
    });

  const handleBack = () => {
    navigation.navigate(Routes.LOGIN_SCREEN);
  };

  const signData = () => {
    var data = SigningBridge.signData(
      '{"cert":{"tree":[1,[4,[215,185,19,205,159,218,174,17,60,50,75,242,164,38,24,109,147,224,4,57,108,110,119,82,102,4,87,100,167,52,27,226]],[1,[4,[58,72,209,252,33,61,73,48,113,3,16,79,125,114,194,181,147,14,219,168,120,123,144,99,31,52,59,58,166,138,95,10]],[2,[116,105,109,101],[3,[200,204,155,166,188,128,187,236,22]]]]],"signature":[181,117,98,29,128,49,115,147,51,44,243,157,177,223,247,83,182,12,46,212,234,175,118,90,73,53,254,117,40,235,190,185,222,71,242,80,198,207,193,217,167,242,29,24,27,89,70,141],"delegation":{"subnet_id":[46,204,41,68,123,14,239,108,36,29,207,223,125,171,7,112,147,204,214,161,38,107,224,254,156,155,18,118,2],"certificate":[217,217,247,162,100,116,114,101,101,131,1,130,4,88,32,249,66,233,213,241,228,119,64,0,9,56,178,23,20,161,166,236,138,248,194,205,64,183,150,83,29,86,196,88,116,141,134,131,1,131,2,70,115,117,98,110,101,116,131,1,131,1,131,1,130,4,88,32,53,188,32,114,102,170,31,154,27,78,234,57,62,254,145,174,51,237,76,231,112,105,237,142,136,29,134,113,106,223,123,107,131,1,130,4,88,32,102,250,154,53,163,33,4,35,115,207,22,83,65,90,14,241,211,140,160,155,225,9,234,74,203,116,233,227,233,205,234,8,131,1,130,4,88,32,54,243,205,37,125,144,251,56,228,37,151,241,147,165,224,49,219,213,133,182,41,39,147,187,4,219,71,148,128,60,224,110,131,2,88,29,46,204,41,68,123,14,239,108,36,29,207,223,125,171,7,112,147,204,214,161,38,107,224,254,156,155,18,118,2,131,1,131,2,79,99,97,110,105,115,116,101,114,95,114,97,110,103,101,115,130,3,88,27,217,217,247,129,130,74,0,0,0,0,0,224,0,0,1,1,74,0,0,0,0,0,239,255,255,1,1,131,2,74,112,117,98,108,105,99,95,107,101,121,130,3,88,133,48,129,130,48,29,6,13,43,6,1,4,1,130,220,124,5,3,1,2,1,6,12,43,6,1,4,1,130,220,124,5,3,2,1,3,97,0,145,84,28,220,123,101,196,130,130,134,201,17,96,45,148,56,222,86,73,214,152,182,15,192,106,236,115,88,147,149,208,188,167,23,70,82,78,210,255,23,178,200,218,159,188,137,127,15,7,164,11,32,72,113,182,254,150,212,94,241,11,81,209,241,213,48,208,103,154,93,184,45,233,105,41,128,95,161,124,115,121,148,235,204,35,18,210,162,91,217,71,71,236,248,243,75,130,4,88,32,36,166,67,130,186,234,41,251,110,200,37,254,141,163,106,125,233,110,187,50,15,242,37,90,177,184,222,213,234,211,27,94,130,4,88,32,220,198,118,226,168,77,241,250,232,136,55,251,99,45,93,254,230,149,233,236,237,216,110,228,200,249,148,210,91,140,16,193,131,2,68,116,105,109,101,130,3,73,163,204,248,194,139,133,167,236,22,105,115,105,103,110,97,116,117,114,101,88,48,177,153,157,46,226,201,240,67,46,40,54,208,88,167,22,200,107,201,203,56,217,210,239,35,146,172,195,229,74,248,149,249,228,79,79,202,253,35,150,175,252,161,218,179,118,254,122,67]}},"request_id":[158,54,162,163,135,135,187,174,111,106,222,181,229,251,223,43,117,85,168,120,32,143,116,174,147,14,177,102,203,186,174,206]}',
    );
    console.log(`response ${data}`);
    setSignedData(data);
  };

  const demoInterchange = () => {
    var data = SigningBridge.interchangeDemo('[DEMO_DATA]');
    console.log(`response ${data}`);
    setSignedData(data);
  };

  return (
    <Container>
      {isInitialized && (
        <Text style={[FontStyles.Normal, styles.valid]} onPress={handleBack}>
          Back
        </Text>
      )}
      <View style={styles.container}>
        <Image source={Plug} />
        <Text style={styles.title}>Welcome to Plug</Text>
        <RainbowButton
          buttonStyle={[styles.componentMargin, styles.buttonStyling]}
          text="Create Wallet"
          onPress={onPress('create')}
        />
        <Button
          buttonStyle={[styles.buttonMargin, styles.buttonStyling]}
          text="Import Wallet"
          onPress={onPress('import')}
        />
        <Button
          buttonStyle={[styles.buttonMargin, styles.buttonStyling]}
          text="Sign Data"
          onPress={() => signData()}
        />
        <Text style={styles.title}>{signedData}</Text>
      </View>
    </Container>
  );
}

export default Welcome;
