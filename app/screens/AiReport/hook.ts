import { useMutation } from '@tanstack/react-query';
import axios from '../../utilities/axios';

const generateReport = async (userId:string) => {
  const response = await axios.post('/generate-report/', {
    user_id: userId,
  }, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const useGenerateReport = () => {
  return useMutation({
    mutationFn: (userId:string) => generateReport(userId),
  });
};
