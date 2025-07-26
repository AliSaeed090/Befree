import {useMutation} from '@tanstack/react-query';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

// API Configuration
const VOICEFLOW_API_KEY = 'VF.DM.6751ed204b8f35d94c2d9157.wi1LCqtKmRByQxq7';
const VOICEFLOW_PROJECT_ID = '674dfc3315084175fe94d0b1';
const VOICEFLOW_VERSION_ID = 'production';
const VOICEFLOW_API_URL = `https://general-runtime.voiceflow.com/state`;
const API_KEY = VOICEFLOW_API_KEY;
//console.log({VOICEFLOW_API_URL});
// Axios instance
const axiosInstance = axios.create({
  baseURL: VOICEFLOW_API_URL,
  headers: {
    Authorization: API_KEY,
    // versionID: VOICEFLOW_VERSION_ID,
    'Content-Type': 'application/json',
  },
});

// Hook to interact with Voiceflow
const askQuery = async (data: any): Promise<any> => {
  //console.log({user_id: data.user_id})
  let action = {
    type: data.type,
    payload: {label: data.label, actions: data.actions},
  };

  const response = await axiosInstance.post(
    `user/${
      // auth().currentUser?.uid
     data.user_id
    }/interact?logs=off`,
    {
      action: action,
      config: {
        tts: false,
        stripSSML: true,
        stopAll: false,
        excludeTypes: ['block', 'debug', 'flow'],
      },
    },
  );
  //console.log({response: response.data});
  // return response.data;
  return extractTextAndChoiceEvents(response.data);
};

function extractTextAndChoiceEvents(response: any) {
  // Parse the input JSON if it's a string
  const events = typeof response === 'string' ? JSON.parse(response) : response;

  let formattedOutput: any = {
    text: null,
    scores: null,
  };

  // Find the 'text' event
  const textEvent = events.find((event: any) => {
    return event?.type === 'text';
  });

  // Find the 'choice' event
  const choiceEvent = events.find((event: any) => event.type === 'choice');
  // //console.log({textEvent});
  if (textEvent) {
    const scores = extractScores(textEvent.payload.message);
    if (
      scores.anxiety ||
      scores.depression ||
      scores.stress ||
      scores.suicide
    ) {
      formattedOutput.scores = scores;
    }
    formattedOutput.text = {
      _id: Math.round(Math.random() * 1000000),
      text: textEvent.payload.message,
      quickReplies: {
        type: 'radio', // or 'checkbox',
        keepIt: false,
        values: choiceEvent
          ? choiceEvent.payload.buttons.map((button: any) => ({
              title: button.name,
              value: button.request?.payload?.label || button.name,
              data: button.request?.payload || null,
              type: button.request?.type || null,
            }))
          : [],
      },
      createdAt: new Date(),

      user: {
        _id: 1,
        name: 'BeFree',
        avatar:
          "https://firebasestorage.googleapis.com/v0/b/befree-fab3e.firebasestorage.app/o/WhatsApp%20Image%202024-12-13%20at%2019.21.33.jpeg?alt=media&token=52be8b94-f430-40cd-8259-c183cadef88f",
      },
    };
  }
  // //console.log({formattedOutput,events});

  return formattedOutput;
}
function extractScores(text: any) {
  const scores: any = {resultSummary:text};

  const patterns = {
    anxiety: /Ansiedad:\s*([\d.]+)/i,
    depression: /Depresión:\s*([\d.]+)/i,
    stress: /Estrés:\s*([\d.]+)/i,
    suicide: /Riesgo de suicidio:\s*([\d.]+)/i,
    overAll: /Puntuación:\s*([\d.]+)/i,
  };

  for (const [key, regex] of Object.entries(patterns)) {
    const match = text.match(regex);
    scores[key] = match ? parseFloat(match[1]) : null;
  }

  return scores;
}
export const useVoiceflowAI = () => {
  return useMutation({
    mutationKey: ['useAskQuery'],
    mutationFn: (data: any) => askQuery(data),
  });
};
