// useAskQuery.ts
import {useMutation, useQuery} from '@tanstack/react-query';
import axios from '../../../utilities/axios';
import {AxiosResponse} from 'axios';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import base64 from 'react-native-base64'
import { Buffer } from "buffer";  // Node.js Buffer
import iconv from "iconv-lite";  // Handles UTF-8 decoding
interface User {
  _id: string | number;
}
interface JoinRoomRequest {
  user_name: string;
  user_id: string;
  room_name: string;
}
interface JoinRoomResponse {
  success: boolean;
  message: string;
  room_id?: string;
}
// Define the request and response types
interface AskQueryRequest {
  _id: string;
  text: string;
  createdAt: any;
  user: User;
  user_id: string;
}

interface AskQueryResponse {
  response: string; // Modify based on your actual API response structure
}

// Function to make the POST request
const askQuery = async (data: AskQueryRequest): Promise<AskQueryResponse> => {
  // console.log({data});
  const response: AxiosResponse<AskQueryResponse> = await axios.post(
    '/ask-query',
    data,
  );
  return response.data;
};

// Fetching chat data from Firebase Firestore
const fetchChatData = async () => {
    try {
      const uid = auth().currentUser?.uid; // Get the current user's UID
      if (!uid) {
        throw new Error("User not authenticated");
      }
  
      // Fetch the specific document for the user's chats
      const snapshot = await firestore().collection('ai_assistant_chat_history').doc(uid).get();
  
      if (!snapshot.exists) {
        console.warn("No chat data found for the user");
        return []; // Return an empty array if no data exists
      }
  
      const data:any = snapshot.data(); // Get the document's data
  
      if (data.messages && Array.isArray(data.messages)) {
        // Decode Firestore Blobs
        data.messages = await Promise.all(
          data.messages.map(async (blob:any, index:any) => {
            try {
              if (blob instanceof firestore.Blob) {
                // Convert Firestore Blob to Base64 string
            const binaryString = blob.toBase64();
            console.log({binaryString})

            // Correct Base64 decoding using Buffer
            let decodedBytes = Buffer.from(binaryString, "base64");

            // Proper UTF-8 decoding with iconv-lite
            let decodedString = iconv.decode(decodedBytes, "utf-8");

            // Parse JSON
            let res = JSON.parse(decodedString);
            // console.log({ res: res.content[0] });

            return res.content[0];
              }  else {
                // console.warn(`Message at index ${index} is not a valid FirestoreBlob.`);
                return null; // Skip invalid blobs
              }
            } catch (error) {
              // console.error(`Error parsing FirestoreBlob at index ${index}:`, error);
              return null; // Skip blobs that fail to parse
            }
          })
        );
  
        // Remove any null values from failed parses
        data.messages = data.messages.filter((message:any) => message !== null);
      }
  
      return data.messages.reverse(); // Wrap the data in an array for consistency
    } catch (error) {
      console.error("Error fetching chat data:", error);
      throw error; // Let React Query handle the error
    }
  };

  const fetchChatDataApi = async (): Promise<any[]> => {
    try {
      const uid = auth().currentUser?.uid; // Get authenticated user's UID
      if (!uid) {
        throw new Error("User not authenticated");
      }
  
      // Call FastAPI backend
      const response = await axios.get<any>(`/chat/${uid}`);
      // console.log({response});
  
      
      return response?.data;
    } catch (error) {
      console.error("Error fetching chat data:", error);
      throw error;
    }
  };
// React Query custom hook
export const useChats = () => {
  return useQuery({
    queryKey: ['useChats'],
    queryFn: () => fetchChatDataApi(),
  }); // Using React Query's useQuery to fetch chat data
};
export const useAskQuery = () => {
  return useMutation({
    mutationKey: ['useAskQuery'],
    // queryFn: () => fetchBibleAssistantQuery(payload),
    mutationFn: (payload: any) => askQuery(payload),
  });
};
const joinRoom = async (data: JoinRoomRequest): Promise<JoinRoomResponse> => {
  const response = await axios.post<JoinRoomResponse>('/join-room', data, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const useJoinRoom = () => {
  return useMutation({
    mutationFn: joinRoom,
  });
};