import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TouchableNativeFeedback,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import { SafeAreaView, Button, Text, Header } from '../../components';
import { BaseColor, BaseStyle, useTheme } from '../../config';
import { Images } from '../../config';
import { useTranslation } from 'react-i18next';
import styles from './styles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { symptomDataEnglish, symptomDataSpanish } from './symptomData';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import i18next from 'i18next';
// import { use } from 'i18next';
// import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';
// import { rgbaColor } from 'react-native-reanimated/lib/typescript/Colors';

interface Props {
  navigation: any;
  route: any;
}
// What is your health goal for the app?
const AppointmentBooking_1: React.FC<Props> = ({ route, navigation }) => {
  const { t } = useTranslation();
  const { scores, level, color, text } = route.params;
  const { colors } = useTheme();
  const [state, setState] = useState({
    heading: '',
    description: '',
    possibleCauses: [],
    symptoms: [],
    tips: [],
  });
  const [activeTab, setActiveTab] = useState('Details');

  const handleTabPress = (tab: any) => {
    setActiveTab(tab);
  };
  const getImage = (text: string) => {
    switch (text) {
      case 'Suicide risk':
        return Images.suicideRisk;
      case 'Anxiety':
        return Images.anxity;
      case 'Depression':
        return Images.depression;
      case 'Stress':
        return Images.stress;
      default:
        return Images.suicideRisk;
    }
  };
  const getText = (text: string) => {
    let symptomData = i18next.language === "es" ? symptomDataSpanish : symptomDataEnglish;
    switch (text) {
      case 'Suicide risk':
        return symptomData.suicideRisk;
      case 'Anxiety':
        return symptomData.anxiety;
      case 'Depression':
        return symptomData.depression;
      case 'Stress':
        return symptomData.stress;
      default:
        return symptomData.stress;
    }
  };

  const getHeading = (scores: number, data: any) => {
    if (scores === 0) {
      return data[0];
    } else if (scores <= 25) {
      return data[1];
    } else if (scores <= 50) {
      return data[2];
    } else if (scores <= 75) {
      return data[3];
    } else {
      return data[4];
    }
  };

  useEffect(() => {
    if (text && scores) {
      let data = getText(text);
      let state = getHeading(scores, data);
      //console.log({state});
      setState(state);
    }
  }, [text, scores]);
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
    <>
      <ScrollView>
        <ImageBackground
          source={getImage(text)}
          style={{
            // ...BaseStyle.safeAreaView,
            // backgroundColor: colors.card,
            // backgroundColor: 'rgba(15, 23, 42, 0.6)',
            height: Dimensions.get('window').height * 0.4,
          }}
          resizeMode="cover"
          imageStyle={{
            // resizeMode: 'cover',
            borderBottomLeftRadius: 32,
            borderBottomRightRadius: 32,
          }}>
            <View style={{
               backgroundColor: 'rgba(15, 23, 42, 0.6)',
            height: Dimensions.get('window').height * 0.4,
            }}>

           
          <SafeAreaView
            style={{ ...BaseStyle.safeAreaView, backgroundColor: 'transparent' }}
            edges={['right', 'top', 'left']}>
            <Header
              renderLeft={() => (
                <View
                  style={{
                    ...styles.leftbtn,
                    backgroundColor: 'rgba(15, 23, 42, 0.32)',
                  }}>
                  <FontAwesome name="angle-left" size={30} color={'white'} />
                </View>
              )}
              onPressLeft={() => {
                navigation.goBack();
              }}
            />

            <View
              style={{
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 20,
                paddingVertical: 10,
                borderBottomLeftRadius: 32,
                borderBottomRightRadius: 32,
                // backgroundColor: 'rgba(15, 23, 42, 0.6)',
                position: 'absolute',
                height: '100%',
                bottom: 0,
                zIndex: -1,
              }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text bold whiteColor header>
                  {t(text).toUpperCase()}
                </Text>
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  marginTop: 40,
                  gap: 20,
                  // marginVertical: 16,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    // width: '30%',
                    backgroundColor: colors.primary,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 10,
                    gap: 5,
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                  }}>
                  <MaterialIcons name="bar-chart" size={20} color={'white'} />
                  <Text whiteColor body2>
                    {/* {t('No Match')} */}
                    {level} {t("Match")}
                  </Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    // width: '30%',
                    backgroundColor: '#D97706',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderRadius: 10,
                    gap: 5,
                    paddingHorizontal: 15,
                    paddingVertical: 5,
                  }}>
                  <FontAwesome name="warning" size={15} color={'white'} />
                  <Text whiteColor body2>
                    {level} {t('Risk')}
                  </Text>
                </View>
              </View>
            </View>
          </SafeAreaView>
          </View>
          {/**/}
        </ImageBackground>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Details' ? styles.activeTab : null,
            ]}
            onPress={() => handleTabPress('Details')}>
            <Text style={styles.tabText}>{t("Details")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'Tips' ? styles.activeTab : null]}
            onPress={() => handleTabPress('Tips')}>
            <Text style={styles.tabText}>{t("Tips")}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          {activeTab === 'Details' && (
            <View style={styles.container}>
              <View style={styles.header}>
                <Text style={styles.headerText}>{t("Risk Factor")}</Text>
                <Text style={styles.riskNumber}>{scores}</Text>
                <View style={styles.contentCenter}>
                  <View
                    style={[
                      styles.contentCenter,
                      { width: `${scores}%`, backgroundColor: color },
                    ]}></View>
                </View>
                <Text style={styles.riskLevel}>{state.heading}</Text>
              </View>

              <View style={styles.description}>
                <Text style={styles.descriptionText}>{state.description}</Text>
              </View>

              <View style={styles.section}>
                {state.possibleCauses.length > 0 && (
                  <Text style={styles.sectionTitle}>{t("Possible_causes")}:</Text>
                )}
                {state.possibleCauses.map((txt: string, i: number) => {
                  return (
                    <View style={styles.listItem}>
                      <View
                        key={i}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 8,
                          margin: 6,
                          backgroundColor: 'white',
                        }}
                      />
                      <Text style={{ color: '#CBD5E1' ,lineHeight: 20}}>{txt}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.section}>
                {state.symptoms.length > 0 && (
                  <Text style={styles.sectionTitle}>{t("Possible_Symptoms")}:</Text>
                )}

                {state.symptoms.map((txt: string, i: number) => {
                  return (
                    <View style={styles.listItem}>
                      <View
                        key={i}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 8,
                          margin: 6,
                          backgroundColor: 'white',
                        }}
                      />
                      <Text style={{ color: '#CBD5E1',lineHeight: 20 }}>{txt}</Text>
                    </View>
                  );
                })}
              </View>

              <View style={{ width: '100%', marginVertical: 5 }}>
                <Button
                  full
                  iconRight={
                    <FontAwesome
                      style={{ marginLeft: 20 }}
                      name="refresh"
                      size={20}
                      color={'white'}
                    />
                  }
                  loading={false}
                  style={{ marginTop: 20, backgroundColor: colors.card }}
                  onPress={() => {
                    navigation.navigate('SymptomsChecker');
                  }}>
                  {t('Re_Take_Symptom_Check')}
                </Button>
              </View>
              <View style={{ width: '100%', marginVertical: 5 }}>
                {/* <Button
                  full
                  iconRight={
                    <FontAwesome
                      style={{marginLeft: 20}}
                      name="calendar"
                      size={20}
                      color={'white'}
                    />
                  }
                  loading={false}
                  style={{marginTop: 20}}
                  onPress={() => {
                    navigation.navigate('AppointmentBooking_1');
                  }}>
                  {t('schedule_new_appointment')}
                </Button> */}
              </View>
            </View>
          )}
          {activeTab === 'Tips' && (
            <View style={styles.container}>
              <View style={styles.header}>
                {state.tips.length > 0 && <Text style={styles.riskLevel}>{t("tips_and_tools")}</Text>}
              </View>

              <View style={styles.section}>
                {state.tips.map((txt: string, i: number) => {
                  return (
                    <View key={i} style={styles.listItem}>
                      <View
                        key={i}
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 8,
                          margin: 6,
                          backgroundColor: 'white',
                        }}
                      />
                      <Text style={{ color: '#CBD5E1',lineHeight: 20 }}>{txt}</Text>
                    </View>
                  );
                })}
              </View>
              <View style={{ width: '100%', marginVertical: 5 }}>
                <Button
                  full
                  iconRight={
                    <FontAwesome5
                      style={{ marginLeft: 20 }}
                      name="robot"
                      size={20}
                      color={'white'}
                    />
                  }
                  loading={false}
                  style={{ marginTop: 20, backgroundColor: colors.card }}
                  onPress={() => {
                    navigation.navigate('AiChat');
                  }}>
                  {t('Consult_AI_Chatbot')}
                </Button>
              </View>
              <View style={{ width: '100%', marginVertical: 5 }}>
                
                {/* <Button
                  full
                  iconRight={
                    <FontAwesome
                      style={{marginLeft: 20}}
                      name="calendar"
                      size={20}
                      color={'white'}
                    />
                  }
                  loading={false}
                  style={{marginTop: 20}}
                  onPress={() => {
                    navigation.navigate('AppointmentBooking_1');
                  }}>
                  {t('schedule_new_appointment')}
                </Button> */}
              </View>
            </View>
          )}
        </View>
        <View style={{ width: '90%',alignSelf:"center", marginVertical: 5, marginBottom: 20 }}>
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
                                        </View> 
      </ScrollView>
    </>
  );
};

export default AppointmentBooking_1;
