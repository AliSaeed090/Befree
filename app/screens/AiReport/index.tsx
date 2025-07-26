import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { useGenerateReport } from './hook';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../redux/index';
import { SafeAreaView, Button, Text, Header } from '../../components';
import { BaseColor, BaseStyle, useTheme, Images } from '../../config';

import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import styles from './styles';
import { useTranslation } from 'react-i18next';

import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AsyncStorage from '@react-native-async-storage/async-storage';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { use } from 'i18next';
import { useUser } from '../../contexts/User';
import EmotionSlider from '../HealthAssessment/components/EmotionSlider';
import { create } from 'react-test-renderer';

const Dashboard = (props: any) => {
    const { ref } = props;
    const { mutateAsync, isPending, isError, error } = useGenerateReport();
    const [report, setReport] = useState<any>({
        createdAt: new Date(),
        report_text: null,
    });
    //console.log({ref: props});
    const { user: userData } = useUser();
    const { t } = useTranslation();
    const { theme, colors } = useTheme();
    const navigation: any = useNavigation();
    const { isAuthenticated, selectedLocation } = useSelector(
        (state: any) => state.Auth,
    );
    useEffect(() => {
        mutateAsync(userData?.uid).then((res: any) => {
            console.log({ res })
            setReport(res)
        })
    }, []);
    const copy = `  
Te compartimos referencias científicas que respaldan los consejos ofrecidos. Todos los artículos provienen de revistas de alto impacto, revisadas por pares.

---

### 1. Terapia Cognitivo-Conductual (TCC)

- Cuijpers et al. (2016)  
[doi.org/10.1016/j.jad.2016.05.045](https://doi.org/10.1016/j.jad.2016.05.045)

- Hofmann et al. (2012)  
[doi.org/10.1007/s10608-012-9476-1](https://doi.org/10.1007/s10608-012-9476-1)

---

### 2. Mindfulness y Meditación

- Goyal et al. (2014)  
[jamanetwork.com/article/1809754](https://jamanetwork.com/journals/jamainternalmedicine/fullarticle/1809754)

---

### 3. Ejercicio físico

- Schuch et al. (2018)  
[doi.org/10.1176/appi.ajp.2018.17111194](https://doi.org/10.1176/appi.ajp.2018.17111194)

- Stubbs et al. (2017)  
[doi.org/10.1080/17437199.2017.128332](https://doi.org/10.1080/17437199.2017.128332)

---

### 4. Respiración y relajación

- Jerath et al. (2006)  
[doi.org/10.1016/j.mehy.2006.02.042](https://doi.org/10.1016/j.mehy.2006.02.042)

---

### 5. Sueño saludable

- Freeman et al. (2017)  
[doi.org/10.1016/S2215-0366(17)30328-0](https://doi.org/10.1016/S2215-0366(17)30328-0)

---

### 6. Autocompasión

Fomentar el autocuidado reduce la autocrítica y mejora la salud mental.

- MacBeth & Gumley (2012)  
[doi.org/10.1016/j.cpr.2012.06.003](https://doi.org/10.1016/j.cpr.2012.06.003)

---

### ✅ Tips clave

- Rodéate de apoyo (amigos, familia, terapeutas).  
- Evita alcohol, drogas y exceso de cafeína.  
- Ponte

  `;
    return (
        <SafeAreaView
            style={[
                // BaseStyle.safeAreaView,
                {
                    // backgroundColor: colors.card,

                    borderBottomStartRadius: 32,
                    borderBottomEndRadius: 32,
                },
            ]}
            edges={['right', 'top', 'left']}>
            <ScrollView>
                <Header
                    style={{
                        // backgroundColor: '#334155',
                        borderBottomStartRadius: 20,
                        borderBottomEndRadius: 20,
                        height: 80,
                    }}
                    renderLeft={() => (
                        <View style={styles.leftbtn}>
                            <FontAwesome name="angle-left" size={30} color={'white'} />
                        </View>
                    )}
                    onPressLeft={() => {
                        navigation.goBack();
                    }}

                    renderCenterConetent={() => (
                        <View style={styles.contentCenter}>
                            <Text callout bold>

                            </Text>
                            <Text callout bold>

                            </Text>
                        </View>
                    )}
                // renderRight={() => (
                //   <FontAwesome name="bell" size={25} color={'white'} />
                // )}
                />

                <View style={{ backgroundColor: colors.background }}>
                    <ScrollView
                        contentInsetAdjustmentBehavior="automatic"
                        style={{ height: '100%' }}
                    >
                         {isPending===true && <ActivityIndicator size="large" color={colors.primary} />}
                        <View style={styles.contentCenter}>
                           
                            <Text bold>{new Date(report.createdAt).toLocaleString()}</Text>
                           <Markdown 
                        style={{
                            body: {color: 'white', fontSize: 15},
                            heading1: {color: 'purple'},
                            code_block: {color: 'black', fontSize: 14}
                          }}
                        
                        >
                            {report.report_text}
                            
                        </Markdown>  
                        {isPending===true ? <View/>:
                        <Markdown 
                        style={{
                            hr: {
                                borderBottomColor: 'white',
                                borderBottomWidth: 1,
                                marginVertical: 12,
                              },
                            body: {color: 'white', fontSize: 10, marginTop: 20},
                            heading1: {color: 'purple'},
                            code_block: {color: 'black', fontSize: 14}
                          }}
                        
                        >
                            {/* {report.report_text} */}
                            {copy}
                        </Markdown>  
}
                        </View>
                    </ScrollView>
                </View>
                <View style={{ width: '100%', height: 200 }} />
            </ScrollView>
        </SafeAreaView>
    );
};
export default Dashboard;
